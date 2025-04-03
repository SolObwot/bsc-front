import axios from '../lib/axios';

export const universityService = {
    getUniversities: async (params) => {
        try {
        const response = await axios.get("/universities", { params });
        return response;
        } catch (error) {
        console.error("Error fetching universities:", error);
        throw error;
        }
    },
    
    getUniversity: async (id) => {
        try {
        const response = await axios.get(`/universities/${id}`);
        return response;
        } catch (error) {
        console.error("Error fetching universitiy:", error);
        throw error;
        }
    },
    
    createUniversitiy: async (universitiyData) => {
        try {
        const response = await axios.post("/universities", universitiyData);
        return response;
        } catch (error) {
        console.error("Error creating universitiy:", error);
        throw error;
        }
    },
    
    updateUniversitiy: async (id, universitiyData) => {
        try {
        const response = await axios.put(`/universities/${id}`, universitiyData);
        return response;
        } catch (error) {
        console.error("Error updating universitiy:", error);
        throw error;
        }
    },
    
    deleteUniversitiy: async (id) => {
        try {
        const response = await axios.delete(`/universities/${id}`);
        return response;
        } catch (error) {
        console.error("Error deleting universitiy:", error);
        throw error;
        }
    },

};