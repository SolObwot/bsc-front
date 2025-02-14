import React from 'react';
import { useToast } from "../../hooks/useToast";
import { userService } from '../../services/user.service';
import { roleService } from '../../services/role.service';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/AlertDialog';

const DeleteRole = ({ roleToDelete, setRoleToDelete, onDeleteSuccess }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!roleToDelete) return;
    try {
      await roleService.deleteRole(roleToDelete.id);
      onDeleteSuccess(roleToDelete.id);
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    } finally {
      setRoleToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the role
            {roleToDelete && ` ${roleToDelete.name}`}
            ' and remove their data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRole;
