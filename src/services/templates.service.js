import axios from '../lib/axios';

export const templatesService = {
  getTemplates: async (params) => {
    try {
      const response = await axios.get('/scorecard-templates/', { params });
      return response;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },
  getTemplate: async (id) => {
    try {
      const response = await axios.get(`/scorecard-templates/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },
  createTemplate: async (templateData) => {
    try {
      const response = await axios.post('/scorecard-templates/', templateData);
      return response;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },
  updateTemplate: async (id, templateData) => {
    try {
      const response = await axios.put(`/scorecard-templates/${id}`, templateData);
      return response;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },
  deleteTemplate: async (id) => {
    try {
      const response = await axios.delete(`/scorecard-templates/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },
};
