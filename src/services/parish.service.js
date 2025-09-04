import axios from '../lib/axios';

export const parishService = {
  getParishes: async (params) => {
    const response = await axios.get('/parishes', { params });
    return response;
  },
  getParish: async (id) => {
    const response = await axios.get(`/parishes/${id}`);
    return response;
  },
  createParish: async (data) => {
    const response = await axios.post('/parishes', data);
    return response;
  },
  updateParish: async (id, data) => {
    const response = await axios.put(`/parishes/${id}`, data);
    return response;
  },
  deleteParish: async (id) => {
    const response = await axios.delete(`/parishes/${id}`);
    return response;
  },
};
