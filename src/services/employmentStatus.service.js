import axios from "../lib/axios";

export const employmentStatusService = {
  getEmploymentStatuses: async (params) => {
    return await axios.get("/employment-statuses", { params });
  },
  getEmploymentStatus: async (id) => {
    return await axios.get(`/employment-statuses/${id}`);
  },
  createEmploymentStatus: async (data) => {
    return await axios.post("/employment-statuses", data);
  },
  updateEmploymentStatus: async (id, data) => {
    return await axios.put(`/employment-statuses/${id}`, data);
  },
  deleteEmploymentStatus: async (id) => {
    return await axios.delete(`/employment-statuses/${id}`);
  },
};
