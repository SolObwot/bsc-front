import axios from '../lib/axios';

export const subCountiesService = {
  getSubCounties: async (params) => {
    const response = await axios.get('/subcounties', { params });
    return response;
  },
  getSubCounty: async (id) => {
    const response = await axios.get(`/subcounties/${id}`);
    return response;
  },
  createSubCounty: async (data) => {
    const response = await axios.post('/subcounties', data);
    return response;
  },
  updateSubCounty: async (id, data) => {
    const response = await axios.put(`/subcounties/${id}`, data);
    return response;
  },
  deleteSubCounty: async (id) => {
    const response = await axios.delete(`/subcounties/${id}`);
    return response;
  },
};
