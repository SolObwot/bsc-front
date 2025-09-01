import React from "react";
import { useToast } from "../../../hooks/useToast";
import { employmentStatusService } from "../../../services/employmentStatus.service";
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
import { fetchEmploymentStatuses } from "../../../redux/employmentStatusSlice";

const DeleteEmploymentStatus = ({ employmentStatusToDelete, setEmploymentStatusToDelete, onDeleteConfirm }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!employmentStatusToDelete) return;
    try {
      await employmentStatusService.deleteEmploymentStatus(employmentStatusToDelete.id);
      toast({
        title: "Success",
        description: "Employment Status deleted successfully",
        variant: "success",
      });
      dispatch(fetchEmploymentStatuses());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Employment Status",
        variant: "destructive",
      });
    } finally {
      setEmploymentStatusToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!employmentStatusToDelete} onOpenChange={() => setEmploymentStatusToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Employment Status
            {employmentStatusToDelete && ` "${employmentStatusToDelete.name}"`} and remove its data.
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

export default DeleteEmploymentStatus;
