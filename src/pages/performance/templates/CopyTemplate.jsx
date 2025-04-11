import React from 'react';
import { useDispatch } from 'react-redux';
import { createTemplate } from '../../../redux/templateSlice';
import { useToast } from '../../../hooks/useToast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../../components/ui/AlertDialog';

const CopyTemplate = ({ templateToCopy, setTemplateToCopy }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!templateToCopy) return;
    try {
      const copyData = {
        ...templateToCopy,
        name: `${templateToCopy.name} (Copy)`,
      };
      delete copyData.id; // Remove ID to create a new template
      await dispatch(createTemplate(copyData));
      toast({
        title: 'Success',
        description: 'Template copied successfully.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy template.',
        variant: 'destructive',
      });
    } finally {
      setTemplateToCopy(null);
    }
  };

  return (
    <AlertDialog open={!!templateToCopy} onOpenChange={() => setTemplateToCopy(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Copy</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to make a copy of the template "{templateToCopy?.name}"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCopy}>Copy</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CopyTemplate;
