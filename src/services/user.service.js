import axios from '../lib/axios';

export const userService = {
  getUsers: (params) => axios.get('/users', { params }),
  getUser: async (id) => {
    return await axios.get(`/users/${id}`);
  },
  updateUser: (id, userData) => axios.put(`/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`/users/${id}`),
};
