import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const authTokens = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  removeToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),
  
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_URL is not defined');
}

class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Function to refresh token
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshToken = async (): Promise<string | null> => {
  try {
    const currentRefreshToken = await authTokens.getRefreshToken();
    if (!currentRefreshToken) return null;

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: currentRefreshToken }),
    });

    if (!response.ok) {
      await authTokens.removeToken();
      await authTokens.removeRefreshToken();
      return null;
    }

    const data = await response.json();
    await authTokens.setToken(data.accessToken);
    await authTokens.setRefreshToken(data.refreshToken);
    return data.accessToken;
  } catch (e) {
    return null;
  }
};

const getValidToken = async (): Promise<string | null> => {
  const token = await authTokens.getToken();
  // Here we would ideally check if token is expired (e.g. decoding JWT)
  // For simplicity, we just return it and handle 401 later.
  return token;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || 'Request failed',
      response.status,
      error.code
    );
  }
  return response.json();
};

export const apiClient = {
  get: async <T>(path: string): Promise<T> => {
    let token = await getValidToken();
    let response = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });

    if (response.status === 401 && token) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }
      token = await refreshPromise;
      if (token) {
        response = await fetch(`${BASE_URL}${path}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    return handleResponse(response);
  },

  post: async <T>(path: string, body: unknown): Promise<T> => {
    let token = await getValidToken();
    let response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401 && token) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }
      token = await refreshPromise;
      if (token) {
        response = await fetch(`${BASE_URL}${path}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }
    }

    return handleResponse(response);
  },
};
