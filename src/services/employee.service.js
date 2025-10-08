import axios from '../lib/axios';

export const employeeService = {
  getEmployee: (id, params) => axios.get(`/employee/${id}`, { params }),
  createEmployee: (id, data) => axios.post(`/employee/${id}`, data),
  updateEmployee: (id, data) => axios.patch(`/employee/${id}`, data),
};

