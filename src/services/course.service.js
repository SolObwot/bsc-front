import axios from '../lib/axios';

export const courseService = {
    getCourses: async (params) => {
        try {
        const response = await axios.get("/courses", { params });
        return response;
        } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
        }
    },
    
    getCourse: async (id) => {
        try {
        const response = await axios.get(`/courses/${id}`);
        return response;
        } catch (error) {
        console.error("Error fetching course:", error);
        throw error;
        }
    },
    
    createCourse: async (courseData) => {
        try {
        const response = await axios.post("/courses", courseData);
        return response;
        } catch (error) {
        console.error("Error creating course:", error);
        throw error;
        }
    },
    
    updateCourse: async (id, courseData) => {
        try {
        const response = await axios.put(`/courses/${id}`, courseData);
        return response;
        } catch (error) {
        console.error("Error updating course:", error);
        throw error;
        }
    },
    
    deleteCourse: async (id) => {
        try {
        const response = await axios.delete(`/courses/${id}`);
        return response;
        } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
        }
    },

};