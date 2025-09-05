import React from "react";
import { useToast } from "../../../hooks/useToast";
import { tribeService } from "../../../services/tribe.service";
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
import { deleteTribeFromState } from "../../../redux/tribeSlice";

const DeleteTribe = ({ tribeToDelete, setTribeToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!tribeToDelete) return;
    try {
      await tribeService.deleteTribe(tribeToDelete.id);
      dispatch(deleteTribeFromState(tribeToDelete.id));
      toast({ title: "Success", description: "Tribe deleted successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete Tribe", variant: "destructive" });
    } finally {
      setTribeToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!tribeToDelete} onOpenChange={() => setTribeToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Tribe
            {tribeToDelete && ` "${tribeToDelete.name}"`} and remove its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setTribeToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTribe;
