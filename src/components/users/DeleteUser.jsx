import React from 'react';
import { useToast } from "../../hooks/useToast";
import { userService } from '../../services/user.service';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../components/ui/AlertDialog';

const DeleteUser = ({ userToDelete, setUserToDelete, onDeleteSuccess }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await userService.deleteUser(userToDelete.id);
      onDeleteSuccess(userToDelete.id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            {userToDelete && ` ${userToDelete.surname} ${userToDelete.last_name}`}
            's account and remove their data. Alternatively you can disabled the account instead
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

export default DeleteUser;
