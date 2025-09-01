import React from "react";
import { useToast } from "../../../hooks/useToast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../components/ui/AlertDialog";
import { useDispatch } from "react-redux";
import { deleteDepartment } from "../../../redux/departmentSlice";

const DeleteDepartment = ({ departmentToDelete, setDepartmentToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await dispatch(deleteDepartment(departmentToDelete.id)).unwrap();
      toast({
        title: "Success",
        description: "Department deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Department",
        variant: "destructive",
      });
    } finally {
      setDepartmentToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!departmentToDelete} onOpenChange={() => setDepartmentToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Department
            {departmentToDelete && ` "${departmentToDelete.name}"`} and remove its data.
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

export default DeleteDepartment;
