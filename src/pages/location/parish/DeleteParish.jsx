import React from "react";
import { useToast } from "../../../hooks/useToast";
import { parishService } from "../../../services/parish.service";
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
import { deleteParishFromState } from "../../../redux/parishSlice";

const DeleteParish = ({ parishToDelete, setParishToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!parishToDelete) return;
    try {
      await parishService.deleteParish(parishToDelete.id);
      dispatch(deleteParishFromState(parishToDelete.id));
      toast({ title: "Success", description: "Parish deleted successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete Parish", variant: "destructive" });
    } finally {
      setParishToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!parishToDelete} onOpenChange={() => setParishToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Parish
            {parishToDelete && ` "${parishToDelete.name}"`} and remove its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setParishToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteParish;
