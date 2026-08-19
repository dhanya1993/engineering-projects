import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

// Attach the stored JWT to every request. Kept simple (localStorage) for
// a demo project; a production app would consider httpOnly cookies to
// avoid exposing the token to XSS.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rbac_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the API ever returns 401, the token is stale/invalid — clear it so
// the app falls back to the login screen instead of looping on 401s.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("rbac_token");
      localStorage.removeItem("rbac_user");
    }
    return Promise.reject(error);
  }
);
