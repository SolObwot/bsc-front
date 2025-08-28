import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourse, updateCourse } from '../../../redux/courseSlice';
import { useToast, ToastContainer } from '../../../hooks/useToast';
import CourseModal from "./CourseModal";

const EditCourse = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCourse, loading, error } = useSelector(state => state.courses);
  
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchCourse(id));
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateCourse({ id, formData })).unwrap();
      toast({
        title: 'Success',
        description: 'Course updated successfully!',
        variant: 'success',
      });
      setIsModalOpen(false);
      navigate('/admin/qualification/course');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update course. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/admin/qualification/course');
  };

  if (loading && !currentCourse) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      {currentCourse && (
        <CourseModal
          isOpen={isModalOpen}
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={currentCourse}
        />
      )}
    </div>
  );
};

export default EditCourse;
