import axios from "../lib/axios";

export const jobTitleService = {
  getJobTitles: async (params) => {
    const response = await axios.get("/job-titles", { params });
    return response;
  },
  getJobTitle: async (id) => {
    const response = await axios.get(`/job-titles/${id}`);
    return response;
  },
  createJobTitle: async (jobTitleData) => {
    const response = await axios.post("/job-titles", jobTitleData);
    return response;
  },
  updateJobTitle: async (id, jobTitleData) => {
    const response = await axios.put(`/job-titles/${id}`, jobTitleData);
    return response.data;
  },
  deleteJobTitle: async (id) => {
    const response = await axios.delete(`/job-titles/${id}`);
    return response;
  },
};
