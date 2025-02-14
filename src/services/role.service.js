import axios from '../lib/axios';

export const roleService = {
    getRoles: (params) => axios.get('/roles', { params }),
    getRole: (id) => axios.get(`/roles/${id}`),
    createRole: (roleData) => axios.post('/roles', roleData),
    updateRole: (id, roleData) => axios.put(`/roles/${id}`, roleData),
    deleteRole: (id) => axios.delete(`/roles/${id}`),

    getPermissions: (params) => axios.get('/permissions', { params }),
    getPermission: (id) => axios.get(`/permissions/${id}`),
    createPermission: (permissionData) => axios.post('/permissions', permissionData),
    updatePermission: (id, permissionData) => axios.put(`/permissions/${id}`, permissionData),
    deletePermission: (id) => axios.delete(`/permissions/${id}`),
};