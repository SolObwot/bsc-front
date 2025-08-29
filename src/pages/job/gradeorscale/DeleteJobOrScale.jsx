import React from "react";
import { useToast } from "../../../hooks/useToast";
import gradeOrScaleService from "../../../services/gradeOrScale.service";
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
import { deleteGradeOrScale, deleteGradeOrScaleFromState } from "../../../redux/gradeOrScaleSlice";

const DeleteJobOrScale = ({ gradeOrScaleToDelete, setGradeOrScaleToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!gradeOrScaleToDelete) return;
    try {
      console.log("DeleteJobOrScale - BEFORE delete API call, id:", gradeOrScaleToDelete.id);
      await gradeOrScaleService.deleteGradeOrScale(gradeOrScaleToDelete.id);
      console.log("DeleteJobOrScale - AFTER delete API call, BEFORE dispatch");
      const result = await dispatch(deleteGradeOrScale(gradeOrScaleToDelete.id));
      console.log("DeleteJobOrScale - AFTER dispatch, result:", result);
      dispatch(deleteGradeOrScaleFromState(gradeOrScaleToDelete.id));
      toast({
        title: "Success",
        description: "Grade/Scale deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Grade/Scale",
        variant: "destructive",
      });
    } finally {
      setGradeOrScaleToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!gradeOrScaleToDelete} onOpenChange={() => setGradeOrScaleToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Grade/Scale
            {gradeOrScaleToDelete && ` "${gradeOrScaleToDelete.name}"`} and remove its data.
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

export default DeleteJobOrScale;
