import { apiRequest, config } from './api';

export async function getDonaciones() {
  return apiRequest(config.endpoints.donaciones) || [];
}

export async function createDonacion(donacion) {
  return apiRequest(config.endpoints.donaciones, {
    method: 'POST',
    body: JSON.stringify(donacion)
  });
}

export async function updateDonacion(donacion) {
  return apiRequest(config.endpoints.donaciones, {
    method: 'PUT',
    body: JSON.stringify(donacion)
  });
}

export async function deleteDonacion(id) {
  return apiRequest(`${config.endpoints.donaciones}?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}
