import { portfolioData, PortfolioContent } from '../content';

const AUTH_KEY = 'portfolio_admin_token';
let cachedToken: string | null = null;

function getApiBase(): string {
  const env = (import.meta as any).env;
  const configured = env && env.VITE_API_URL;
  return configured || '';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = cachedToken || localStorage.getItem(AUTH_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${getApiBase()}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem(AUTH_KEY);
    cachedToken = null;
    throw new Error('unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const data = await request<{ token: string }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem(AUTH_KEY, data.token);
    cachedToken = data.token;
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  if (!(cachedToken || localStorage.getItem(AUTH_KEY))) return false;
  try {
    await request('/api/content');
    return true;
  } catch (e: any) {
    return e.message !== 'unauthorized';
  }
}

export async function logout(): Promise<void> {
  try {
    await request('/api/logout', { method: 'POST' });
  } catch {
    // ignore
  }
  localStorage.removeItem(AUTH_KEY);
  cachedToken = null;
}

export function initializeAuth(): Promise<void> {
  return Promise.resolve();
}

export async function getPortfolioData(): Promise<PortfolioContent> {
  try {
    const data = await request<PortfolioContent | null>('/api/content');
    if (data) return data;
  } catch {
    // fall back to local/default on network error (public view)
  }
  return JSON.parse(JSON.stringify(portfolioData));
}

export async function savePortfolioData(data: PortfolioContent): Promise<void> {
  await request('/api/content', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function resetPortfolioData(): Promise<void> {
  await request('/api/content', { method: 'DELETE' });
}

export interface UploadedImage {
  id: string;
  url: string;
}

export async function uploadImage(
  base64: string,
  contentType: string,
  filename: string
): Promise<UploadedImage> {
  const data = await request<UploadedImage>('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ data: base64, contentType, filename }),
  });
  return data;
}

export async function deleteMedia(id: string): Promise<void> {
  await request(`/api/media/${id}`, { method: 'DELETE' });
}

export function hasStoredData(): boolean {
  return false;
}
