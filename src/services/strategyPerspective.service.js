import axios from '../lib/axios';

export const strategyPerspectiveService = {
  // Get all department weights
  getDepartmentWeights: async () => {
    try {
      const response = await axios.get('/department-weights/');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific department weight
  getDepartmentWeight: async (id) => {
    try {
      const response = await axios.get(`/department-weights/${id}/fetch`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create a new department weight
  createDepartmentWeight: async (formData) => {
    try {
      const response = await axios.post('/department-weights/', formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update a department weight
  updateDepartmentWeight: async (id, formData) => {
    try {
      // Ensure we're sending the weight field as expected by the server
      const safeData = {
        weight: formData.weight
      };
      
      // Add these fields if they exist in the original data
      if (formData.department_id !== undefined) safeData.department_id = formData.department_id;
      if (formData.strategy_perspective_id !== undefined) safeData.strategy_perspective_id = formData.strategy_perspective_id;
      
      const response = await axios.put(`/department-weights/${id}`, safeData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete a department weight
  deleteDepartmentWeight: async (id) => {
    try {
      const response = await axios.delete(`/department-weights/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Approve a department weight
  approveDepartmentWeight: async (id) => {
    try {
      const response = await axios.post(`/department-weights/${id}/approve`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reject a department weight
  rejectDepartmentWeight: async (id, reason) => {
    try {
      const response = await axios.post(`/department-weights/${id}/reject`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }
};
