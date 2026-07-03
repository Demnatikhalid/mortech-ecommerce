import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// Helper to read cookie values in JS
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const originalFetch = window.fetch;

// Bootstrap function to fetch CSRF cookie if it does not exist
const ensureCsrfToken = async () => {
  let token = getCookie('csrf_token');

  if (!token) {
    try {
      // URL de ton backend Railway
      await originalFetch(`${import.meta.env.VITE_API_URL}/api/health`);

      token = getCookie('csrf_token');
    } catch (e) {
      console.warn('WAF CSRF bootstrap failed:', e);
    }
  }

  return token;
};

// Intercept window.fetch to automatically read and attach X-CSRF-Token headers
window.fetch = async (input, init) => {
  const method = (init && init.method ? init.method : 'GET').toUpperCase();
  const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

  if (stateChangingMethods.includes(method)) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      init = init || {};
      init.headers = init.headers || {};
      if (init.headers instanceof Headers) {
        init.headers.set('X-CSRF-Token', csrfToken);
      } else if (Array.isArray(init.headers)) {
        const idx = init.headers.findIndex(([k]) => k.toLowerCase() === 'x-csrf-token');
        if (idx !== -1) {
          init.headers[idx][1] = csrfToken;
        } else {
          init.headers.push(['X-CSRF-Token', csrfToken]);
        }
      } else {
        init.headers['X-CSRF-Token'] = csrfToken;
      }
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')).render(<App />);
