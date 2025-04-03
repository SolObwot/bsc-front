import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourse, updateCourse } from '../../../redux/courseSlice';
import { useToastNavigation } from '../../../hooks/useToastNavigation';
import CourseForm from "./CourseForm";


const EditCourse = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { toastAndNavigate } = useToastNavigation();
  const { currentCourse, loading, error } = useSelector(state => state.courses);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCourse(id));
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(updateCourse({ id, formData }));
    if (updateCourse.fulfilled.match(resultAction)) {
      toastAndNavigate(
        { title: 'Success', description: 'Course updated!', variant: 'success' },
        '/admin/qualification/course'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Course data not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 mt-8">
      <CourseForm
        section="Edit Course"
        initialData={currentCourse}
        onSubmit={handleSubmit}
        // onCancel={() => navigate("/admin/qualification/course")}
        onCancel={() => toastAndNavigate(
          { title: 'Info', description: 'Changes discarded', variant: 'default' },
          '/admin/qualification/course'
        )}
      />
    </div>
  );
};

export default EditCourse;
