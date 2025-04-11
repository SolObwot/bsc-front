import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../../components/ui/AlertDialog';

const PreviewTemplate = ({ templateToPreview, setTemplateToPreview }) => {
return (
    <AlertDialog open={!!templateToPreview} onOpenChange={() => setTemplateToPreview(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Preview Template</AlertDialogTitle>
                <AlertDialogDescription>
                    {templateToPreview ? (
                        <div>
                            <p><strong>Name:</strong> {templateToPreview.name}</p>
                            <p><strong>Strategic Objective:</strong> {templateToPreview.strategic_objective}</p>
                            <p><strong>Review Period:</strong> {templateToPreview.review_period || 'N/A'}</p>
                            <p><strong>Created By:</strong> {templateToPreview.user?.surname} {templateToPreview.user?.last_name}</p>
                        </div>
                    ) : (
                        <p>No template selected for preview.</p>
                    )}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);
};

export default PreviewTemplate;
