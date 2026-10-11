import Constants from 'expo-constants';

export class APIError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Native gets config.extra; SDK 57 web may omit the runtime manifest.
  const base = Constants.expoConfig?.extra?.backendUrl ?? process.env.EXPO_PUBLIC_BACKEND_URL;
  if (!base) throw new Error('Connection is not configured. Please try again later.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(`${String(base).replace(/\/$/, '')}/api${path}`, {
      ...options, signal: controller.signal,
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new APIError(response.status, typeof data.detail === 'string' ? data.detail : 'Please check your details and try again.');
    return data as T;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new Error('Could not connect. Please check your connection and try again.');
  } finally { clearTimeout(timeout); }
}