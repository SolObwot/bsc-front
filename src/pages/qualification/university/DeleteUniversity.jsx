import React from 'react';
import { useToast } from "../../../hooks/useToast";
import { useDispatch } from 'react-redux';
import { deleteUniversity } from '../../../redux/universitySlice';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../../components/ui/AlertDialog';

const DeleteUniversity = ({ universityToDelete, setUniversityToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!universityToDelete) return;
    try {
      await dispatch(deleteUniversity(universityToDelete.id)).unwrap();
      toast({
        title: "Success",
        description: "University deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete university",
        variant: "destructive",
      });
    } finally {
      setUniversityToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!universityToDelete} onOpenChange={() => setUniversityToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the university
            {universityToDelete && ` "${universityToDelete.name}"`} and remove its data.
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

export default DeleteUniversity;
