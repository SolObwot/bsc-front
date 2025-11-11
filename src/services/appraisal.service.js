import axios from '../lib/axios';

export const appraisalService = {
  getAppraisals: async (params = {}) => {
    try {
      const response = await axios.get('/appraisals', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAppraisalsFromUrl: async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAppraisal: async (id) => {
    try {
      const response = await axios.get(`/appraisals/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAppraisal: async (formData) => {
    try {
      const response = await axios.post('/appraisals', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAppraisal: async (id, formData) => {
    try {
      const response = await axios.put(`/appraisals/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAppraisal: async (id) => {
    try {
      const response = await axios.delete(`/appraisals/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitAppraisal: async (id) => {
    try {
      const response = await axios.post(`/appraisals/${id}/submit`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};