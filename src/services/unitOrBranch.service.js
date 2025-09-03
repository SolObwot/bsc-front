import axios from '../lib/axios';

export const unitOrBranchService = {
  getUnitOrBranches: async (params) => {
    const response = await axios.get('/units-branches', { params });
    return response;
  },
  getUnitOrBranch: async (id) => {
    const response = await axios.get(`/units-branches/${id}`);
    return response;
  },
  createUnitOrBranch: async (unitOrBranchData) => {
    const response = await axios.post('/units-branches', unitOrBranchData);
    return response;
  },
  updateUnitOrBranch: async (id, unitOrBranchData) => {
    const response = await axios.put(`/units-branches/${id}`, unitOrBranchData);
    return response.data;
  },
  deleteUnitOrBranch: async (id) => {
    const response = await axios.delete(`/units-branches/${id}`);
    return response;
  },
};