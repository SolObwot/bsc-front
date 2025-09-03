import axios from '../lib/axios';

export const countyService = {
  getCounties: async (params) => {
    const response = await axios.get('/counties', { params });
    return response;
  },
  getCounty: async (id) => {
    const response = await axios.get(`/counties/${id}`);
    return response;
  },
  createCounty: async (data) => {
    const response = await axios.post('/counties', data);
    return response;
  },
  updateCounty: async (id, data) => {
    const response = await axios.put(`/counties/${id}`, data);
    return response;
  },
  deleteCounty: async (id) => {
    const response = await axios.delete(`/counties/${id}`);
    return response;
  },
};
