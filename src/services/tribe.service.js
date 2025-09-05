import axios from '../lib/axios';

export const tribeService = {
  getTribes: async (params) => {
    const response = await axios.get('/tribes', { params });
    return response;
  },
  getTribe: async (id) => {
    const response = await axios.get(`/tribes/${id}`);
    return response;
  },
  createTribe: async (data) => {
    const response = await axios.post('/tribes', data);
    return response;
  },
  updateTribe: async (id, data) => {
    const response = await axios.put(`/tribes/${id}`, data);
    return response;
  },
  deleteTribe: async (id) => {
    const response = await axios.delete(`/tribes/${id}`);
    return response;
  },
};
