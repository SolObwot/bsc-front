import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../../hooks/useToast";
import { roleService } from '../../services/role.service';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '../../components/ui/AlertDialog';
import RoleForm from './RoleForm';

const AddRole = ({ roleToAdd, setRoleToAdd, onAddSuccess }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNewRole = async (formData) => {
    try {
      const response = await roleService.createRole({ name: formData.name });
      toast({
        title: "Success",
        description: "Role added successfully",
      });
      onAddSuccess(response.data);
      setRoleToAdd(false);
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: "Error",
        description: "Failed to add role",
        variant: "destructive",
      });
    } 
  };

  return (
    <AlertDialog open={roleToAdd} onOpenChange={() => setRoleToAdd(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className='text-2xl font-bold'>Add New Role</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for the new role below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <RoleForm 
          onSubmit={handleNewRole}
          onCancel={() => setRoleToAdd(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddRole;