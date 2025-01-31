import axios from 'axios';

// Ensure that you have a .env file in the root of your project with the following variable:
// VITE_API_URL

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Avoid reload loop by not redirecting to /login here
      console.error('Unauthorized access - 401');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;