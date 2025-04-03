import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUniversity, updateUniversity } from '../../../redux/universitySlice';
import { useToastNavigation } from '../../../hooks/useToastNavigation';
import UniversityForm from "./UniversityForm";

const EditUniversity = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { toastAndNavigate } = useToastNavigation();
  const { currentUniversity, loading, error } = useSelector(state => state.universities);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUniversity(id));
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(updateUniversity({ id, formData }));
    if (updateUniversity.fulfilled.match(resultAction)) {
      toastAndNavigate(
        { title: 'Success', description: 'University updated!', variant: 'success' },
        '/admin/qualification/university'
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

  if (!currentUniversity) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">University data not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 mt-8">
      <UniversityForm
        section="Edit University"
        initialData={currentUniversity}
        onSubmit={handleSubmit}
        onCancel={() => toastAndNavigate(
          { title: 'Info', description: 'Changes discarded', variant: 'default' },
          '/admin/qualification/university'
        )}
      />
    </div>
  );
};

export default EditUniversity;
