import axios from '../lib/axios';

export const userService = {
  getUsers: (params) => axios.get('/users', { params }),
  getUser: async (id) => {
    return await axios.get(`/users/${id}`);
  },
  createUser: async (userData) => {
    try {
      console.log('Sending request to create user:', userData);
      const response = await axios.post('/users', userData);
      console.log('Response from create user:', response);
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
  updateUser: (id, userData) => axios.put(`/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`/users/${id}`),
  forgotPassword: (email) => axios.post('/forgot-password', { email }),
  resetPassword: (token, email, password) => axios.post('/reset-password', { token, email, password }),
  changePassword: (data) => axios.put('/user/password', data),

};
