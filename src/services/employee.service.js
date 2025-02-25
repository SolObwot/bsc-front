import axios from '../lib/axios';

export const employeeService = {
  getEmployeeContacts: (employeeId) => axios.get(`/employee/${employeeId}/contact`),
  createContact: (data) => axios.post('/contact-details', data),
  updateContact: (id, data) => axios.patch(`/contact-details/${id}`, data),
  deleteContact: (id) => axios.delete(`/contact-details/${id}`)
};

