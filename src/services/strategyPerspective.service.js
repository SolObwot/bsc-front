import axios from '../lib/axios';

export const strategyPerspectiveService = {
  // Get all department weights
  getDepartmentWeights: async () => {
    try {
      const response = await axios.get('/department-weights/');
      return response;
    } catch (error) {
      console.error("Error fetching department weights:", error);
      throw error;
    }
  },

  // Get a specific department weight
  getDepartmentWeight: async (id) => {
    try {
      const response = await axios.get(`/department-weights/${id}/fetch`);
      return response;
    } catch (error) {
      console.error(`Error fetching department weight with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new department weight
  createDepartmentWeight: async (formData) => {
    try {
      console.log('🔍 Service - Request payload:', formData);
      console.log('🔍 Service - Using endpoint: /department-weights/');

      // Add request config logging
      const config = {
        headers: axios.defaults.headers
      };
      console.log('🔍 Service - Request config:', config);

      const response = await axios.post('/department-weights/', formData);
      console.log('✅ Service - Response:', response);
      return response;
    } catch (error) {
      console.error('🛑 Service - Error creating department weight:', error);
      console.error('🛑 Service - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
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
      
      console.log(`🔍 Service - Updating weight ${id} with sanitized data:`, safeData);
      
      // Log the exact request being sent for debugging
      console.log('Update request URL:', `/department-weights/${id}`);
      console.log('Update request data:', JSON.stringify(safeData));
      
      const response = await axios.put(`/department-weights/${id}`, safeData);
      console.log('✅ Service - Update response:', response);
      return response;
    } catch (error) {
      console.error(`Error updating department weight with ID ${id}:`, error);
      console.error('🛑 Service - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Delete a department weight
  deleteDepartmentWeight: async (id) => {
    try {
      console.log(`🔍 Service - Deleting weight ${id}`);
      const response = await axios.delete(`/department-weights/${id}`);
      console.log('✅ Service - Delete response:', response);
      return response;
    } catch (error) {
      console.error(`Error deleting department weight with ID ${id}:`, error);
      console.error('🛑 Service - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Approve a department weight
  approveDepartmentWeight: async (id) => {
    try {
      console.log(`🔍 Service - Approving weight ${id}`);
      const response = await axios.post(`/department-weights/${id}/approve`);
      console.log('✅ Service - Approve response:', response);
      return response;
    } catch (error) {
      console.error(`Error approving department weight with ID ${id}:`, error);
      console.error('🛑 Service - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Reject a department weight
  rejectDepartmentWeight: async (id, reason) => {
    try {
      console.log(`🔍 Service - Rejecting weight ${id} with reason:`, reason);
      const response = await axios.post(`/department-weights/${id}/reject`, { reason });
      console.log('✅ Service - Reject response:', response);
      return response;
    } catch (error) {
      console.error(`Error rejecting department weight with ID ${id}:`, error);
      console.error('🛑 Service - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
};
