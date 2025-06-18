import axios from '../lib/axios';

export const agreementService = {
  // Get all agreements or my agreements
  getAgreements: async (params = {}) => {
    try {
      const response = await axios.get('/agreements', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific agreement
  getAgreement: async (id) => {
    try {
      const response = await axios.get(`/agreements/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new agreement
  createAgreement: async (formData) => {
    try {
      const response = await axios.post('/agreements', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an agreement
  updateAgreement: async (id, formData) => {
    try {
      const response = await axios.put(`/agreements/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete an agreement
  deleteAgreement: async (id) => {
    try {
      const response = await axios.delete(`/agreements/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit an agreement for review
  submitAgreement: async (id) => {
    try {
      const response = await axios.post(`/agreements/${id}/submit`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supervisor approval
  supervisorApproval: async (id, data) => {
    try {
      const response = await axios.post(`/agreements/${id}/supervisor-approval`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // HOD approval
  hodApproval: async (id, data) => {
    try {
      const response = await axios.post(`/agreements/${id}/hod-approval`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};