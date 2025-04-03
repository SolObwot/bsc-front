import React from 'react';
import { useToast } from "../../../hooks/useToast";
import { courseService } from '../../../services/course.service';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../../components/ui/AlertDialog';
import { useDispatch } from 'react-redux';
import { deleteCourseFromState } from '../../../redux/courseSlice';

const DeleteCourse = ({ courseToDelete, setCourseToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      await courseService.deleteCourse(courseToDelete.id);
      dispatch(deleteCourseFromState(courseToDelete.id)); 
      toast({
        title: "Success",
        description: "Course deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    } finally {
      setCourseToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the course
            {courseToDelete && ` "${courseToDelete.name}"`} and remove its data.
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

export default DeleteCourse;
