// RoleEdit.jsx
import React, { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { roleService } from '../../services/role.service';
import AlertDialog, { 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription 
} from '../ui/AlertDialog';
import RoleForm from './RoleForm';

const RoleEdit = ({ roleToEdit, setRoleToEdit, onEditSuccess }) => {
  const { toast } = useToast();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (!roleToEdit?.id) return;

      setLoading(true);
      try {
        const response = await roleService.getRole(roleToEdit.id);
        setRole({
          id: response.data.id,
          name: response.data.name,
          permissions: Array.isArray(response.data.permissions) ? response.data.permissions : [],
        });
        console.log('Fetched role data:', response.data);
      } catch (error) {
        console.error('Error fetching role:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch role data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [roleToEdit, toast]);

  const handleFormSubmit = async (formData) => {
    console.log('Submitting form data:', formData);
    try {
      await roleService.updateRole(roleToEdit.id, formData);
      onEditSuccess();
      setRoleToEdit(null);
      toast({
        title: 'Success',
        description: 'Role updated successfully',
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      });
    }
  };

  if (loading) return null;

  return (
    <AlertDialog open={!!roleToEdit} onOpenChange={(open) => !open && setRoleToEdit(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="text-2xl font-bold">Edit Role</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Update the role details below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {role && (
          <RoleForm
            onSubmit={handleFormSubmit}
            initialData={role}
            onCancel={() => setRoleToEdit(null)}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoleEdit;