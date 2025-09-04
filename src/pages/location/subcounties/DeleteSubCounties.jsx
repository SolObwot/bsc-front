import React from "react";
import { useToast } from "../../../hooks/useToast";
import { subCountiesService } from "../../../services/subCounties.service";
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
import { deleteSubCountyFromState } from "../../../redux/subCountiesSlice";

const DeleteSubCounties = ({ subCountyToDelete, setSubCountyToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!subCountyToDelete) return;
    try {
      await subCountiesService.deleteSubCounty(subCountyToDelete.id);
      dispatch(deleteSubCountyFromState(subCountyToDelete.id));
      toast({ title: "Success", description: "Sub-County deleted successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete Sub-County", variant: "destructive" });
    } finally {
      setSubCountyToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!subCountyToDelete} onOpenChange={() => setSubCountyToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Sub-County
            {subCountyToDelete && ` "${subCountyToDelete.name}"`} and remove its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setSubCountyToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSubCounties;
