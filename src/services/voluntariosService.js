import { apiRequest, config } from './api';

export async function getVoluntarios() {
  return apiRequest(config.endpoints.voluntarios) || [];
}

export async function createVoluntario(voluntario) {
  return apiRequest(config.endpoints.voluntarios, {
    method: 'POST',
    body: JSON.stringify(voluntario)
  });
}

export async function updateVoluntario(voluntario) {
  return apiRequest(config.endpoints.voluntarios, {
    method: 'PUT',
    body: JSON.stringify(voluntario)
  });
}

export async function deleteVoluntario(id) {
  return apiRequest(`${config.endpoints.voluntarios}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}
