import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'portfolio';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'ghostadmin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ghostadmin123';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env');
  throw new Error('MONGODB_URI is not set');
}

export const app = express();
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '25mb' })); // allow base64 CV PDF uploads

const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
});

let db;
let sessions = new Map(); // token -> expiry

async function connectDB() {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Connecting to MongoDB (attempt ${attempt}/${maxRetries})...`);
      await client.connect();
      db = client.db(DB_NAME);
      await db.collection('sessions').createIndex({ token: 1 }, { unique: true });
      await db.collection('sessions').createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
      console.log(`Connected to MongoDB (${DB_NAME})`);
      return;
    } catch (err) {
      console.error(`Attempt ${attempt} failed: ${err.message}`);
      if (err.message.includes('ECONNREFUSED') || err.message.includes('querySrv')) {
        console.error('\n  Possible causes:');
        console.error('  1. MongoDB Atlas cluster is paused — check https://cloud.mongodb.com');
        console.error('  2. Your IP is not whitelisted — add it in Atlas Network Access settings');
        console.error('  3. DNS cannot resolve the cluster — try a different network or DNS server');
        console.error('');
      }
      if (attempt < maxRetries) {
        const delay = attempt * 5000;
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw new Error('Could not connect to MongoDB after ' + maxRetries + ' attempts');
}

async function scryptHash(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
}

async function createUser(username, password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await scryptHash(password, salt);
  return {
    username,
    salt,
    hash,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function verifyUser(username, password) {
  const user = await db.collection('users').findOne({ username });
  if (!user) return null;
  const derived = await scryptHash(password, user.salt);
  return derived === user.hash ? user : null;
}

async function seedAdminUser() {
  const existing = await db.collection('users').findOne({ username: ADMIN_USERNAME });
  if (!existing) {
    const user = await createUser(ADMIN_USERNAME, ADMIN_PASSWORD);
    await db.collection('users').insertOne(user);
    console.log(`Created admin user: ${ADMIN_USERNAME}`);
  } else {
    // Keep in sync with .env password, re-hash if changed
    const derived = await scryptHash(ADMIN_PASSWORD, existing.salt);
    if (derived !== existing.hash) {
      const updated = await createUser(ADMIN_USERNAME, ADMIN_PASSWORD);
      await db.collection('users').updateOne(
        { username: ADMIN_USERNAME },
        { $set: { salt: updated.salt, hash: updated.hash, updatedAt: new Date() } }
      );
      console.log(`Updated admin user password: ${ADMIN_USERNAME}`);
    }
  }
}

async function createSession() {
  const token = crypto.randomBytes(32).toString('hex');
  const expireAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
  sessions.set(token, expireAt.getTime());
  await db.collection('sessions').insertOne({ token, createdAt: new Date(), expireAt });
  return token;
}

async function isValidSession(token) {
  if (!token) return false;
  const local = sessions.get(token);
  if (local && local > Date.now()) return true;
  sessions.delete(token);
  const doc = await db.collection('sessions').findOne({ token });
  if (doc && doc.expireAt > new Date()) return true;
  return false;
}

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  try {
    if (!(await isValidSession(token))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  } catch (e) {
    res.status(500).json({ error: 'Auth check failed' });
  }
}

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await client.db().admin().ping();
    res.json({ ok: true, db: DB_NAME });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Auth
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const user = await verifyUser(username, password);
  if (user) {
    const token = await createSession();
    return res.json({ token, username: user.username });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/logout', requireAuth, async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  sessions.delete(token);
  await db.collection('sessions').deleteMany({ token });
  res.json({ ok: true });
});

app.post('/api/change-password', requireAuth, async (req, res) => {
  const { oldPassword, newPassword, username } = req.body || {};
  const uname = username || ADMIN_USERNAME;
  const user = await verifyUser(uname, oldPassword);
  if (!user) {
    return res.status(401).json({ error: 'Old password incorrect' });
  }
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'New password too short' });
  }
  const updated = await createUser(user.username, newPassword);
  await db.collection('users').updateOne(
    { username: user.username },
    { $set: { salt: updated.salt, hash: updated.hash, updatedAt: new Date() } }
  );
  res.json({ ok: true });
});

// Content
app.get('/api/content-public', async (_req, res) => {
  try {
    const doc = await db.collection('content').findOne({ _id: 'portfolio' });
    res.json(doc ? doc.data : null);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/content', requireAuth, async (_req, res) => {
  const doc = await db.collection('content').findOne({ _id: 'portfolio' });
  res.json(doc ? doc.data : null);
});

app.put('/api/content', requireAuth, async (req, res) => {
  const data = req.body;
  if (!data) return res.status(400).json({ error: 'No data' });
  await db.collection('content').updateOne(
    { _id: 'portfolio' },
    { $set: { data, updatedAt: new Date() } },
    { upsert: true }
  );
  res.json({ ok: true });
});

app.delete('/api/content', requireAuth, async (_req, res) => {
  await db.collection('content').deleteOne({ _id: 'portfolio' });
  res.json({ ok: true });
});

// Media / image uploads
app.post('/api/upload', requireAuth, async (req, res) => {
  const { data, contentType, filename } = req.body || {};
  if (!data || typeof data !== 'string') {
    return res.status(400).json({ error: 'No image data' });
  }
  // Limit ~5MB of base64 payload
  if (data.length > 6_700_000) {
    return res.status(413).json({ error: 'Image too large (max ~5MB)' });
  }
  const buffer = Buffer.from(data, 'base64');
  if (!buffer.length) return res.status(400).json({ error: 'Invalid image data' });

  const result = await db.collection('media').insertOne({
    data: buffer,
    contentType: contentType || 'image/jpeg',
    filename: filename || 'image',
    size: buffer.length,
    createdAt: new Date(),
  });
  res.json({ id: result.insertedId.toString(), url: `/api/media/${result.insertedId}` });
});

app.get('/api/media/:id', async (req, res) => {
  let id;
  try {
    id = new ObjectId(req.params.id);
  } catch {
    return res.status(400).json({ error: 'Invalid media id' });
  }
  const doc = await db.collection('media').findOne({ _id: id });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  const buf = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from(doc.data.buffer || doc.data);
  res.set('Content-Type', doc.contentType);
  res.set('Content-Length', buf.length.toString());
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.end(buf);
});

app.delete('/api/media/:id', requireAuth, async (req, res) => {
  let id;
  try {
    id = new ObjectId(req.params.id);
  } catch {
    return res.status(400).json({ error: 'Invalid media id' });
  }
  const result = await db.collection('media').deleteOne({ _id: id });
  res.json({ ok: result.deletedCount > 0 });
});

// Serve built frontend in production (local only; Vercel serves dist/ itself)
if (!process.env.VERCEL) {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

let connectPromise;

export function connect() {
  if (!connectPromise) {
    connectPromise = (async () => {
      await connectDB();
      await seedAdminUser();
    })().catch((err) => {
      connectPromise = undefined;
      throw err;
    });
  }
  return connectPromise;
}

async function startLocal() {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

if (process.env.VERCEL) {
  console.log('Running on Vercel (serverless).');
} else {
  startLocal();
}
