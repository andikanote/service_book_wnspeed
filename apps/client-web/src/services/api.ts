/// <reference types="vite/client" />

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api/v1';

async function parseResponseError(res: Response, endpoint: string) {
  try {
    const errorJson = await res.json();
    if (errorJson.message) {
      if (Array.isArray(errorJson.message)) {
        return errorJson.message.join(', ');
      }
      return errorJson.message;
    }
  } catch {
    // Non-JSON response
  }
  return `Permintaan gagal (${res.status} ${res.statusText})`;
}

export const apiClient = {
  getBaseUrl() {
    return API_BASE_URL;
  },

  async get(endpoint: string) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const errMsg = await parseResponseError(res, endpoint);
      throw new Error(errMsg);
    }
    return res.json();
  },

  async post(endpoint: string, data: any) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errMsg = await parseResponseError(res, endpoint);
      throw new Error(errMsg);
    }
    return res.json();
  },

  async patch(endpoint: string, data: any) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errMsg = await parseResponseError(res, endpoint);
      throw new Error(errMsg);
    }
    return res.json();
  },

  async delete(endpoint: string) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const errMsg = await parseResponseError(res, endpoint);
      throw new Error(errMsg);
    }
    return res.json();
  },
};
