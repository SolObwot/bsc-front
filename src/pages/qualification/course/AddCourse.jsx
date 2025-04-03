import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';
import CourseForm from './CourseForm';
import { useToast, ToastContainer } from '../../../hooks/useToast';
import { courseService } from '../../../services/course.service';

// Add createCourse thunk to courseSlice
export const createCourse = createAsyncThunk(
  'courses/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await courseService.createCourse(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const AddCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.courses);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(createCourse(formData));
    if (createCourse.fulfilled.match(resultAction)) {
      toast({
        title: 'Success',
        description: 'Course added successfully.',
        variant: 'success',
      });
      navigate('/admin/qualification/course');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add course. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <CourseForm
        section="Add Course"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/qualification/course')}
        isLoading={loading}
      />
    </div>
  );
};

export default AddCourse;
