import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate } from '../../../redux/templateSlice';
import TemplateForm from './TemplateForm';
import { useToast, ToastContainer } from '../../../hooks/useToast';

const AddTemplate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.templates);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(createTemplate(formData));
    if (createTemplate.fulfilled.match(resultAction)) {
      toast({
        title: 'Success',
        description: 'Template added successfully.',
        variant: 'success',
      });
      navigate('/performance/templates');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add template. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <TemplateForm
        section="Add Template"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/performance/templates')}
        isLoading={loading}
      />
    </div>
  );
};

export default AddTemplate;
