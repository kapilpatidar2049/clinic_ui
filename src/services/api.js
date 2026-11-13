import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach Authorization Token to every outgoing request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle unauthorized gracefully
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear token
      // localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;
