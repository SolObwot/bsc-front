import axios from '../lib/axios';

let isLoggedIn = false;

export const authService = {
  login: async (credentials) => {
    const response = await axios.post('/login', credentials);
    isLoggedIn = true;
    return response;
  },
  register: (userData) => axios.post('/register', userData),
  logout: async () => {
    const response = await axios.post('/logout');
    isLoggedIn = false;
    return response;
  },
  getCurrentUser: () => {
    if (isLoggedIn) {
      return axios.get('/users');
    } else {
      return null;
    }
  },
};