import axios from '../lib/axios';

export const userService = {
  getUsers: (params) => axios.get('/users', { params }),
  getUser: (id) => axios.get(`/users/${id}`),
  createUser: (userData) => axios.post('/users', userData),
  updateUser: (id, userData) => axios.put(`/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`/users/${id}`),
};
