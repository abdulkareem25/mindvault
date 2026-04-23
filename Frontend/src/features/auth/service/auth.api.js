import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true
});

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
    const response = await api.post('/signup', { name, email, password, confirmpassword });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
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