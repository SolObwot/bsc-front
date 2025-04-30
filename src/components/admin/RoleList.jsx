import React, { useState, useEffect } from 'react';
import { roleService } from '../../services/role.service';  
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import Button from '../ui/Button';
// import { Checkbox } from '../ui/checkbox';
import { useToast } from "../../hooks/useToast";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Tables';
import DeleteRole from './DeleteRole';
import AddRole from './AddRole';
import RoleEdit from './RoleEdit';
import { PERMISSIONS } from '../../constants/permissions';

const RoleList = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [roleToAdd, setRoleToAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rolePermissions, setRolePermissions] = useState({}); // Track permissions for each role
  const { toast } = useToast();
  const [roleToEdit, setRoleToEdit] = useState(null);

  const fetchRoles = async () => {
    try {
      const response = await roleService.getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Handle permission changes in the RoleList table
  const handlePermissionChange = (roleId, permission, checked) => {
    setRolePermissions((prev) => ({
      ...prev,
      [`${roleId}-${permission}`]: checked,
    }));
  };

  // Handle the "Update" button click
  const handleEdit = (roleId) => {
    // Collect the selected permissions for the role
    const selectedPermissions = Object.entries(rolePermissions).reduce((acc, [key, value]) => {
      if (key.startsWith(`${roleId}-`)) {
        const permission = key.split('-')[1];
        acc[permission] = value;
      }
      return acc;
    }, {});

    // Set the role to edit and pass the selected permissions
    setRoleToEdit({
      id: roleId,
      permissions: selectedPermissions,
    });
  };

  const handleDeleteSuccess = (roleId) => {
    setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
    toast({
      title: 'Success',
      description: 'Role deleted successfully',
    });
  };

  const handleAddSuccess = (newRole) => {
    setRoles((prevRoles) => [...prevRoles, newRole]);
    toast({
      title: 'Success',
      description: 'Role added successfully',
    });
  };

  const handleEditSuccess = () => {
    fetchRoles(); // Refresh the roles list
    toast({
      title: 'Success',
      description: 'Role updated successfully',
    });
  };

  return (
    <div className="w-full p-4 mt-8">
      <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Button
            type="button"
            variant="pride"
            className="flex items-center gap-2"
            onClick={() => setRoleToAdd(true)}
          >
            <UserPlusIcon className="h-5 w-5" aria-hidden="true" />
            Create New Role
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Role Name</TableHeader>
              <TableHeader colSpan={4} className="text-center">
                Permissions (Create, Read, Update, Delete)
              </TableHeader>
              <TableHeader>Action</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>
                  {role.name
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </TableCell>
                <TableCell colSpan={4}>
                  <div className="space-y-2">
                    {Object.entries(PERMISSIONS).map(([group, permissions]) => (
                      <div key={group} className="flex items-center">
                        <div className="w-1/4">{group.replace('_', ' ')}</div>
                        <div className="flex-1 grid grid-cols-4 gap-4">
                          {Object.values(permissions).map((permission) => (
                            <div key={permission} className="flex justify-center">
                              
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(role.id)}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5"
                    >
                      <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Edit {role.name}</span>
                      <span>Update</span>
                    </button>
                    <button
                      onClick={() => setRoleToDelete(role)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5"
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      <span>Delete</span>
                      <span className="sr-only">Delete {role.name}</span>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteRole
        roleToDelete={roleToDelete}
        setRoleToDelete={setRoleToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <AddRole
        roleToAdd={roleToAdd}
        setRoleToAdd={setRoleToAdd}
        onAddSuccess={handleAddSuccess}
      />
      <RoleEdit
        roleToEdit={roleToEdit}
        setRoleToEdit={setRoleToEdit}
        onEditSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default RoleList;