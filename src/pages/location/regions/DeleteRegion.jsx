import React from "react";
import { useToast } from "../../../hooks/useToast";
import { regionsService } from "../../../services/regions.service";
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
import { deleteRegionFromState } from "../../../redux/regionSlice";

const DeleteRegion = ({ regionToDelete, setRegionToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!regionToDelete) return;
    try {
      await regionsService.deleteRegion(regionToDelete.id);
      dispatch(deleteRegionFromState(regionToDelete.id));
      toast({ title: "Success", description: "Region deleted successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete Region", variant: "destructive" });
    } finally {
      setRegionToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!regionToDelete} onOpenChange={() => setRegionToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Region
            {regionToDelete && ` "${regionToDelete.name}"`} and remove its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setRegionToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRegion;
