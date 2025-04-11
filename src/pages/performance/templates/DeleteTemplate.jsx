import React from 'react';
import { useToast } from '../../../hooks/useToast';
import { templatesService } from '../../../services/templates.service';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../../components/ui/AlertDialog';
import { useDispatch } from 'react-redux';
import { deleteTemplateFromState } from '../../../redux/templateSlice';

const DeleteTemplate = ({ templateToDelete, setTemplateToDelete }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!templateToDelete) return;
    try {
      await templatesService.deleteTemplate(templateToDelete.id);
      dispatch(deleteTemplateFromState(templateToDelete.id));
      toast({
        title: 'Success',
        description: 'Template deleted successfully.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template.',
        variant: 'destructive',
      });
    } finally {
      setTemplateToDelete(null);
    }
  };

  return (
    <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the template
            {templateToDelete && ` "${templateToDelete.name}"`} and remove its data.
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

export default DeleteTemplate;
