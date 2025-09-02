import axios from "../lib/axios";

export const relationService = {
    getRelations: async (params) => {
        const response = await axios.get("/relations", { params });
        return response;
    },
    getRelation: async (id) => {
        const response = await axios.get(`/relations/${id}`);
        return response;
    },
    createRelation: async (relationData) => {
        const response = await axios.post("/relations", relationData);
        return response;
    },
    updateRelation: async (id, relationData) => {
        const response = await axios.put(`/relations/${id}`, relationData);
        return response.data;
    },
    deleteRelation: async (id) => {
        const response = await axios.delete(`/relations/${id}`);
        return response;
    },
};
