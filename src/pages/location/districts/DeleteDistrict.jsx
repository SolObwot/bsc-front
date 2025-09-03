import React from "react";
import { useToast } from "../../../hooks/useToast";
import { districtService } from "../../../services/distirct.service";
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
import { deleteDistrictFromState } from "../../../redux/districtSlice";

const DeleteDistrict = ({ districtToDelete, setDistrictToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!districtToDelete) return;
    try {
      await districtService.deleteDistrict(districtToDelete.id);
      dispatch(deleteDistrictFromState(districtToDelete.id));
      toast({ title: "Success", description: "District deleted successfully", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete District", variant: "destructive" });
    } finally {
      setDistrictToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!districtToDelete} onOpenChange={() => setDistrictToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the District
            {districtToDelete && ` "${districtToDelete.name}"`} and remove its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDistrictToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDistrict;
