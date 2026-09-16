const API_SERVICIOS_URL = import.meta.env.VITE_API_SERVICIOS_URL || 'https://reforestapi.codeconheiner.com';
const API_AUTH_URL = import.meta.env.VITE_API_AUTH_URL || 'https://auth.codeconheiner.com';

export const AUTH_TOKEN_KEY = 'reforest_token';

export const config = {
  API_SERVICIOS_URL,
  API_AUTH_URL,
  endpoints: {
    login: `${API_AUTH_URL}/api/auth/login`,
    incendios: `${API_SERVICIOS_URL}/api/incendios`,
    donaciones: `${API_SERVICIOS_URL}/api/donaciones`,
    voluntarios: `${API_SERVICIOS_URL}/api/voluntarios`
  }
};

export function getToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const authHeaders = getAuthHeaders();
  Object.entries(authHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('La API devolvió una respuesta JSON inválida.');
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = '/login';
    }
    throw new Error(data?.mensaje || data?.message || `Error HTTP ${response.status}`);
  }

  return data;
}
