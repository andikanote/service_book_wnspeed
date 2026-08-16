/// <reference types="vite/client" />

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = {
  async get(endpoint: string) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `GET ${endpoint} failed with status ${res.status}`);
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
      const errorText = await res.text();
      throw new Error(errorText || `POST ${endpoint} failed with status ${res.status}`);
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
      const errorText = await res.text();
      throw new Error(errorText || `PATCH ${endpoint} failed with status ${res.status}`);
    }
    return res.json();
  },
};
