const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const APP_TOKEN = import.meta.env.VITE_API_APP_TOKEN;

export async function apiFetch(endpoint, options = {}) {
  const userToken = localStorage.getItem('user_jwt_token');

  const headers = {
    'Content-Type': 'application/json',
    'x-api-token': APP_TOKEN,
    ...options.headers,
  };

  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('user_jwt_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login';
    throw new Error('Sesión expirada o no autorizada. Inicia sesión nuevamente.');
  }

  if (response.status === 403) {
    alert('Acceso restringido: no cuentas con permisos para realizar esta acción.');
    throw new Error('Acceso prohibido (403).');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Error HTTP ${response.status}`);
  }

  return data;
}