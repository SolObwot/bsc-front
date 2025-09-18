import axios from '../lib/axios';

export const userService = {
  getUsers: async (params) => {
    const response = await axios.get('/users', { params });
    return response;
  },
  getUser: async (id) => {
    const response = await axios.get(`/users/${id}`);
    return response;
  },
  createUser: async (userData) => {
    try {
      const response = await axios.post('/users', userData);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error('Validation error:', error.response.data);
      } else {
        console.error('Error in createUser:', error.response || error.message);
      }
      throw error;
    }
  },
  updateUser: async (id, userData) => {
    const response = await axios.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await axios.delete(`/users/${id}`);
    return response;
  },
  forgotPassword: (email) => axios.post('/forgot-password', { email }),
  resetPassword: (token, email, password) => axios.post('/reset-password', { token, email, password }),
  changePassword: (data) => axios.put('/user/password', data),

  lockUser: async (id) => {
    const response = await axios.put(`/users/${id}/lock`);
    return response.data;
  },
  
  unlockUser: async (id) => {
    const response = await axios.put(`/users/${id}/unlock`);
    return response.data;
  },
};
