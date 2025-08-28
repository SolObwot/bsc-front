import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../../redux/courseSlice';
import { useToast, ToastContainer } from '../../../hooks/useToast';
import CourseModal from './CourseModal';

const AddCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.courses);
  
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(createCourse(formData)).unwrap();
      toast({
        title: 'Success',
        description: 'Course added successfully.',
        variant: 'success',
      });
      setIsModalOpen(false);
      navigate('/admin/qualification/course');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add course. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/admin/qualification/course');
  };

  return (
    <div>
      <ToastContainer />
      <CourseModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={null}
      />
    </div>
  );
};

export default AddCourse;
