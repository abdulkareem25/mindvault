import axios from "axios";
import { API_BASE_URL } from "../../../constants";
import store from "../../../app/app.store";
import { setToken, clearAuth } from "../auth.slice";

const api = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      originalRequest.url !== '/refresh' &&
      originalRequest.url !== '/login'
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = refreshResponse.data;
        store.dispatch(setToken(accessToken));
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearAuth());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const signup = async (name, email, password, confirmPassword) => {
  try {
    const response = await api.post('/signup', { name, email, password, confirmPassword });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    if (errorData) {
      // Handle validation errors (422) - extract from errors array
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const message = errorData.errors.map((e) => e.message).join(', ');
        throw new Error(message);
      }
      // Handle other error responses
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    }
    throw new Error('Network error');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await api.post('/resend-verification', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/refresh');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};