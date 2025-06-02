import axios from '../lib/axios';

export const strategicObjectiveService = {
    getDepartmentObjectives: async (params) => {
        try {
            const response = await axios.get("/department-objectives/department", { params });
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    getStrategicObjective: async (id) => {
        try {
            const response = await axios.get(`/department-objectives/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    createStrategicObjective: async (objectiveData) => {
        try {
            const response = await axios.post("/department-objectives", objectiveData);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    updateStrategicObjective: async (id, objectiveData) => {
        try {
            const response = await axios.put(`/department-objectives/${id}`, objectiveData);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    deleteStrategicObjective: async (id) => {
        try {
            const response = await axios.delete(`/department-objectives/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    approveStrategicObjective: async (id) => {
        try {
            const response = await axios.post(`/department-objectives/${id}/approve`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    rejectStrategicObjective: async (id, reason) => {
        try {
            const response = await axios.post(`/department-objectives/${id}/reject`, { reason });
            return response;
        } catch (error) {
            throw error;
        }
    }
};
