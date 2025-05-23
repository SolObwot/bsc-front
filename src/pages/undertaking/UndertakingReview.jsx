import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const UndertakingReview = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/hr/annual-undertaking/view');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Review Submissions</h2>
          <p className="text-gray-500">View and manage employee undertaking submissions</p>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Button>
      </div>

      <div className="mt-8 text-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Submission Review Coming Soon</h3>
        <p className="text-gray-500">
          This feature will allow HR administrators to review and manage all employee undertaking submissions, 
          track completion status, and send reminders for outstanding forms.
        </p>
      </div>
    </div>
  );
};

export default UndertakingReview;
