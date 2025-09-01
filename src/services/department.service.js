import axios from "../lib/axios";

export const departmentService = {
  getDepartments: async (params) => {
    const response = await axios.get("/departments", { params });
    return response;
  },
  getDepartment: async (id) => {
    const response = await axios.get(`/departments/${id}`);
    return response;
  },
  createDepartment: async (departmentData) => {
    const response = await axios.post("/departments", departmentData);
    return response;
  },
  updateDepartment: async (id, departmentData) => {
    const response = await axios.put(`/departments/${id}`, departmentData);
    return response.data;
  },
  deleteDepartment: async (id) => {
    const response = await axios.delete(`/departments/${id}`);
    return response;
  },
};
