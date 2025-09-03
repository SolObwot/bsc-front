import React from "react";
import { useToast } from "../../../hooks/useToast";
import { countyService } from "../../../services/county.service";
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
import { deleteCountyFromState } from "../../../redux/countySlice";

const DeleteCounty = ({ countyToDelete, setCountyToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!countyToDelete) return;
    try {
      await countyService.deleteCounty(countyToDelete.id);
      dispatch(deleteCountyFromState(countyToDelete.id));
      toast({ title: "Success", description: "County deleted successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete County", variant: "destructive" });
    } finally {
      setCountyToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!countyToDelete} onOpenChange={() => setCountyToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the County
            {countyToDelete && ` "${countyToDelete.name}"`} and remove its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCountyToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCounty;
