import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUniversity } from '../../../redux/universitySlice';
import { useToast, ToastContainer } from '../../../hooks/useToast';
import UniversityModal from './UniversityModal';

const AddUniversity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.universities);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(createUniversity(formData)).unwrap();
      toast({
        title: 'Success',
        description: 'University added successfully.',
        variant: 'success',
      });
      setIsModalOpen(false);
      navigate('/admin/qualification/university');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add university. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/admin/qualification/university');
  };

  return (
    <div>
      <ToastContainer />
      <UniversityModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={null}
      />
    </div>
  );
};

export default AddUniversity;
