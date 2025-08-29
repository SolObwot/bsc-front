import axios from "../lib/axios";

const gradeOrScaleService = {
    getGradesOrScales: async (params) => {
        const response = await axios.get("/grades-scales", { params });
        return response;
    },
    getGradeOrScale: async (id) => {
        const response = await axios.get(`/grades-scales/${id}`);
        return response;
    },
    createGradeOrScale: async (data) => {
        const response = await axios.post("/grades-scales", data);
        return response;
    },
    updateGradeOrScale: async (id, data) => {
        const response = await axios.put(`/grades-scales/${id}`, data);
        return response.data;
    },
    deleteGradeOrScale: async (id) => {
        const response = await axios.delete(`/grades-scales/${id}`);
        return response;
    },
};

export default gradeOrScaleService;