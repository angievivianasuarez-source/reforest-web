import { apiRequest, config } from './api';

export async function getIncendios() {
  return apiRequest(config.endpoints.incendios) || [];
}

export async function createIncendio(incendio) {
  return apiRequest(config.endpoints.incendios, {
    method: 'POST',
    body: JSON.stringify(incendio)
  });
}

export async function updateIncendio(incendio) {
  return apiRequest(config.endpoints.incendios, {
    method: 'PUT',
    body: JSON.stringify(incendio)
  });
}

export async function deleteIncendio(id) {
  return apiRequest(`${config.endpoints.incendios}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}
