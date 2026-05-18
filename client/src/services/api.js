import axios from 'axios';
import { store } from '../stores/store';
import { logout } from '../stores/authSlice';

let apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Clean up trailing slashes
apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');

// Append /api/v1 if not present
if (!apiBaseUrl.endsWith('/api/v1')) {
  apiBaseUrl = `${apiBaseUrl}/api/v1`;
}

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // Send cookies with requests
});

// Request interceptor: add access token to headers
api.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and silent refresh
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Update the access token in Redux (we'd dispatch an action here normally, but to avoid circular dep issues in some setups, we can dispatch directly on the store)
        store.dispatch({
          type: 'auth/setCredentials',
          payload: { user: store.getState().auth.user, accessToken: data.accessToken },
        });

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, log user out
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default api;
