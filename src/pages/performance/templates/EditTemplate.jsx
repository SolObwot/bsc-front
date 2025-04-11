import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplate, updateTemplate } from '../../../redux/templateSlice';
import { useToastNavigation } from '../../../hooks/useToastNavigation';
import TemplateForm from './TemplateForm';

const EditTemplate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { toastAndNavigate } = useToastNavigation();
  const { currentTemplate, loading } = useSelector((state) => state.templates);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTemplate(id));
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(updateTemplate({ id, formData }));
    if (updateTemplate.fulfilled.match(resultAction)) {
      toastAndNavigate(
        { title: 'Success', description: 'Template updated successfully.', variant: 'success' },
        '/performance/templates'
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

  if (!currentTemplate) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Template data not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 mt-8">
      <TemplateForm
        section="Edit Template"
        initialData={currentTemplate}
        onSubmit={handleSubmit}
        onCancel={() => toastAndNavigate(
          { title: 'Info', description: 'Changes discarded.', variant: 'default' },
          '/performance/templates'
        )}
      />
    </div>
  );
};

export default EditTemplate;
