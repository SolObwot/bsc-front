import axios from '../lib/axios';

export const strategicObjectiveService = {
    getDepartmentObjectives: async (params) => {
        try {
            const response = await axios.get("/department-objectives/department", { params });
            return response;
        } catch (error) {
            console.error("Error fetching strategic objectives:", error);
            throw error;
        }
    },
    
    getStrategicObjective: async (id) => {
        try {
            // Using the updated API endpoint
            const response = await axios.get(`/department-objectives/${id}/fetch`);
            return response;
        } catch (error) {
            console.error("Error fetching strategic objective:", error);
            throw error;
        }
    },
    
    createStrategicObjective: async (objectiveData) => {
        try {
            console.log('🔍 Service - Request payload:', objectiveData);
            console.log('🔍 Service - Using endpoint: /department-objectives/create-and-assign');
            
            // Add request config logging
            const config = {
                headers: axios.defaults.headers
            };
            console.log('🔍 Service - Request config:', config);
            
            const response = await axios.post("/department-objectives/create-and-assign", objectiveData);
            console.log('✅ Service - Response:', response);
            return response;
        } catch (error) {
            console.error('🛑 Service - Error creating strategic objective:', error);
            console.error('🛑 Service - Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },
    
    updateStrategicObjective: async (id, objectiveData) => {
        try {
            const response = await axios.put(`/department-objectives/${id}`, objectiveData);
            return response;
        } catch (error) {
            console.error("Error updating strategic objective:", error);
            throw error;
        }
    },
    
    deleteStrategicObjective: async (id) => {
        try {
            const response = await axios.delete(`/department-objectives/${id}`);
            return response;
        } catch (error) {
            console.error("Error deleting strategic objective:", error);
            throw error;
        }
    },
    
    approveStrategicObjective: async (id) => {
        try {
            const response = await axios.post(`/department-objectives/${id}/approve`);
            return response;
        } catch (error) {
            console.error("Error approving strategic objective:", error);
            throw error;
        }
    },
    
    rejectStrategicObjective: async (id, reason) => {
        try {
            const response = await axios.post(`/department-objectives/${id}/reject`, { reason });
            return response;
        } catch (error) {
            console.error("Error rejecting strategic objective:", error);
            throw error;
        }
    }
};
