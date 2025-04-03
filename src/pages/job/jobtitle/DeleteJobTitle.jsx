import React from "react";
import { useToast } from "../../../hooks/useToast";
import { jobTitleService } from "../../../services/jobTitle";
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
import { deleteJobTitleFromState } from "../../../redux/jobTitleSlice";

const DeleteJobTitle = ({ jobTitleToDelete, setJobTitleToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!jobTitleToDelete) return;
    try {
      await jobTitleService.deleteJobTitle(jobTitleToDelete.id);
      dispatch(deleteJobTitleFromState(jobTitleToDelete.id));
      toast({
        title: "Success",
        description: "Job Title deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Job Title",
        variant: "destructive",
      });
    } finally {
      setJobTitleToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!jobTitleToDelete} onOpenChange={() => setJobTitleToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Job Title
            {jobTitleToDelete && ` "${jobTitleToDelete.name}"`} and remove its data.
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

export default DeleteJobTitle;
