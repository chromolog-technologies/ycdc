// Backend API base, set per environment with VITE_API_URL (e.g. https://api.ycdc.in/api).
// Falls back to the local Laravel dev server.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

// Backend origin, for files it serves (uploads, signed lead attachments, legacy admin)
export const BACKEND_URL = API_BASE_URL.replace(/\/api$/, '');
export const ADMIN_BASE_URL = `${BACKEND_URL}/admin`;

/**
 * Absolute URL for a file stored by the backend (e.g. "/uploads/doctors/x.jpg").
 * Full URLs pass through, and other relative paths are the website's own static assets.
 */
export const backendAssetUrl = (path?: string | null): string => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (/^\/?uploads\//.test(path)) return `${BACKEND_URL}/${path.replace(/^\//, '')}`;
  return path;
};
