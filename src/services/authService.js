import { AUTH_TOKEN_KEY, config, getToken } from './api';

export function isAuthenticated() {
  return Boolean(getToken());
}

export async function loginUser(identificador, contrasena) {
  const response = await fetch(config.endpoints.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ identificador, contrasena })
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
    }
    throw new Error(data?.mensaje || data?.message || `Error HTTP ${response.status}`);
  }

  if (!data?.token) {
    throw new Error('La API no devolvió un token de autenticación.');
  }

  sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
  return data;
}

export function logoutUser() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  window.location.href = '/login';
}
