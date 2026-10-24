import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  // No fixed Content-Type: axios sends JSON for objects and multipart for FormData.
  // Forcing application/json made axios convert FormData to JSON and drop uploaded files.
  headers: {
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ycdc_admin_token');
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ycdc_admin_token');
      localStorage.removeItem('ycdc_admin_user');
      // Redirect to AdminPortal login state
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default api;
