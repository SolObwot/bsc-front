import axios from '../lib/axios';

export const performanceMeasureService = {
  // Get department objectives and perspectives
  getDepartmentObjectives: async () => {
    try {
      const response = await axios.get('/department-objectives/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all performance measures with optional params
  getPerformanceMeasures: async (params = {}) => {
    try {
      const response = await axios.get('/performance-measures', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get performance measures from dashboard for authenticated user
  getDashboardPerformanceMeasures: async (params = {}) => {
    try {
      const response = await axios.get('/performance-measures/dashboard', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },  

  // Get performance measures by agreement_id
  getPerformanceMeasuresByAgreement: async (agreementId, params = {}) => {
    try {
      const requestParams = { ...params, agreement_id: agreementId };
      const response = await axios.get('/performance-measures', { params: requestParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  

  // Get a specific performance measure
  getPerformanceMeasure: async (id) => {
    try {
      const response = await axios.get(`/performance-measures/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new performance measure
  createPerformanceMeasure: async (measureData) => {
    try {
      const response = await axios.post('/performance-measures', measureData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a performance measure
  updatePerformanceMeasure: async (id, measureData) => {
    try {
      const response = await axios.put(`/performance-measures/${id}`, measureData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a performance measure
  deletePerformanceMeasure: async (id) => {
    try {
      const response = await axios.delete(`/performance-measures/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get performance measures from a specific URL (for pagination)
  getPerformanceMeasuresFromUrl: async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add qualitative levels (bulk)
  addQualitativeLevels: async (levelsArray) => {
    try {
      const response = await axios.post('/qualitative-performance-levels', { levels: levelsArray });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update qualitative levels (bulk)
  updateQualitativeLevels: async (levelsArray) => {
    try {
      const response = await axios.put('/qualitative-performance-levels', { levels: levelsArray });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

};
