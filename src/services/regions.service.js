import axios from '../lib/axios';

export const regionsService = {
  getRegions: async (params) => {
    const response = await axios.get('/regions', { params });
    return response;
  },
  getRegion: async (id) => {
    const response = await axios.get(`/regions/${id}`);
    return response;
  },
  createRegion: async (data) => {
    const response = await axios.post('/regions', data);
    return response;
  },
  updateRegion: async (id, data) => {
    const response = await axios.put(`/regions/${id}`, data);
    return response;
  },
  deleteRegion: async (id) => {
    const response = await axios.delete(`/regions/${id}`);
    return response;
  },
};
