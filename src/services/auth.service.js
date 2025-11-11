import axios from '../lib/axios';

export const authService = {
  login: async (credentials) => {
    const response = await axios.post('/login', credentials);
    return response;
  },
  register: (userData) => axios.post('/register', userData),
  logout: async () => {
    const response = await axios.post('/logout');
    return response;
  },
  getCurrentUser: () => {
    return axios.get('/user'); 
  },
};