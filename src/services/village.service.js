import axios from '../lib/axios';

export const villageService = {
  getVillages: async (params) => {
    const response = await axios.get('/villages', { params });
    return response;
  },
  getVillage: async (id) => {
    const response = await axios.get(`/villages/${id}`);
    return response;
  },
  createVillage: async (data) => {
    const response = await axios.post('/villages', data);
    return response;
  },
  updateVillage: async (id, data) => {
    const response = await axios.put(`/villages/${id}`, data);
    return response;
  },
  deleteVillage: async (id) => {
    const response = await axios.delete(`/villages/${id}`);
    return response;
  },
};
