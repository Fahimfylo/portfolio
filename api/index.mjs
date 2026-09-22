import { app, connect } from '../server.mjs';

let ready;

export default async function handler(req, res) {
  if (!ready) ready = connect();
  await ready;
  app(req, res);
}