import axios from '../lib/axios';

export const districtService = {
  getDistricts: async (params) => {
    const response = await axios.get('/districts', { params });
    return response;
  },
  getDistrict: async (id) => {
    const response = await axios.get(`/districts/${id}`);
    return response;
  },
  createDistrict: async (data) => {
    const response = await axios.post('/districts', data);
    return response;
  },
  updateDistrict: async (id, data) => {
    const response = await axios.put(`/districts/${id}`, data);
    return response;
  },
  deleteDistrict: async (id) => {
    const response = await axios.delete(`/districts/${id}`);
    return response;
  },
};
