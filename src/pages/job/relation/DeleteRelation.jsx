import React from "react";
import { useToast } from "../../../hooks/useToast";
import { relationService } from "../../../services/relation.service";
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
import { deleteRelationFromState } from "../../../redux/relationSlice";

const DeleteRelation = ({ relationToDelete, setRelationToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!relationToDelete) return;
    try {
      await relationService.deleteRelation(relationToDelete.id);
      dispatch(deleteRelationFromState(relationToDelete.id));
      toast({
        title: "Success",
        description: "Relation deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Relation",
        variant: "destructive",
      });
    } finally {
      setRelationToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!relationToDelete} onOpenChange={() => setRelationToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Relation
            {relationToDelete && ` "${relationToDelete.name}"`} and remove its data.
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

export default DeleteRelation;
