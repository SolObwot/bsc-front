import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useToast, ToastContainer } from '../../../hooks/useToast';
import UniversityForm from './UniversityForm';
import { createUniversity } from '../../../redux/universitySlice';

const AddUniversity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.universities);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(createUniversity(formData));
    if (createUniversity.fulfilled.match(resultAction)) {
      toast({
        title: 'Success',
        description: 'University added successfully.',
        variant: 'success',
      });
      navigate('/admin/qualification/university');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add university. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <UniversityForm
        section="Add University"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/qualification/university')}
        isLoading={loading}
      />
    </div>
  );
};

export default AddUniversity;
