import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUniversity, updateUniversity } from '../../../redux/universitySlice';
import { useToast, ToastContainer } from '../../../hooks/useToast';
import UniversityModal from "./UniversityModal";

const EditUniversity = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUniversity, loading, error } = useSelector(state => state.universities);

  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchUniversity(id));
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateUniversity({ id, formData })).unwrap();
      toast({
        title: 'Success',
        description: 'University updated successfully!',
        variant: 'success',
      });
      setIsModalOpen(false);
      navigate('/admin/qualification/university');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update university. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/admin/qualification/university');
  };

  if (loading && !currentUniversity) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      {currentUniversity && (
        <UniversityModal
          isOpen={isModalOpen}
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={currentUniversity}
        />
      )}
    </div>
  );
};

export default EditUniversity;
