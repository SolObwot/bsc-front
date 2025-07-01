import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../lib/utils';
import Modal from '../../../components/ui/Modal';

const getPerformanceLevels = (performanceMeasure) => {
  if (!performanceMeasure) return [];

  return [
    {
      rating: 5,
      level: "Outstanding",
      range: `Greater than ${performanceMeasure.outstanding_threshold}`,
      weight: performanceMeasure.outstanding_threshold,
    },
    {
      rating: 4,
      level: "Exceeds Expectations",
      range: `${performanceMeasure.exceeds_expectations_threshold}-${performanceMeasure.outstanding_threshold}`,
      weight: performanceMeasure.exceeds_expectations_threshold,
    },
    {
      rating: 3,
      level: "Meets Expectations",
      range: `${performanceMeasure.meets_expectations_threshold}`,
      weight: performanceMeasure.meets_expectations_threshold,
    },
    {
      rating: 2,
      level: "Needs Improvement",
      range: `${performanceMeasure.needs_improvement_threshold}-${performanceMeasure.meets_expectations_threshold}`,
      weight: performanceMeasure.needs_improvement_threshold,
    },
    {
      rating: 1,
      level: "Unsatisfactory",
      range: `Less than ${performanceMeasure.needs_improvement_threshold}`,
      weight: performanceMeasure.unsatisfactory_threshold,
    },
  ];
};

const formatDisplayValue = (value, measurementType) => {
  if (measurementType === 'date') {
    try {
      // Handle Date objects
      if (value instanceof Date) {
        return value.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // Handle ISO date strings
      if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (e) {
      console.error("Error formatting date:", e);
    }
  }
  
  return value;
};

const PreviewModal = ({ 
  isOpen, 
  closeModal, 
  indicator,
  onNavigate,
  hasNext,
  hasPrevious,
  totalCount,
  currentIndex
}) => {
  const isQualitative = indicator?.type === "qualitative";
  
  // Custom title with navigation controls
  const customTitle = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        <span className="text-[20px] font-semibold text-gray-700">
          Performance Measure Details
        </span>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {totalCount}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onNavigate('prev')}
          disabled={!hasPrevious}
          className={cn(
            "p-2 rounded-full transition-colors",
            hasPrevious 
              ? "hover:bg-teal-100 text-gray-600" 
              : "text-gray-300 cursor-not-allowed"
          )}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onNavigate('next')}
          disabled={!hasNext}
          className={cn(
            "p-2 rounded-full transition-colors",
            hasNext 
              ? "hover:bg-teal-100 text-gray-600" 
              : "text-gray-300 cursor-not-allowed"
          )}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={closeModal}
      title={customTitle}
      footer={
        <button
          type="button"
          onClick={closeModal}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
      }
    >
      <div className="space-y-6">
        {/* Performance Details */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="font-medium text-gray-900">Performance Details</h3>
          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{indicator?.name}</dd>
            </div>
            {!isQualitative && (
              <>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Target Value</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDisplayValue(indicator?.targetValue, indicator?.measurementType)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Measurement Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{indicator?.measurementType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Weight</dt>
                  <dd className="mt-1 text-sm text-gray-900">{indicator?.weight}</dd>
                </div>
              </>
            )}
          </dl>
        </div>

        {/* Qualitative Rubric */}
        {isQualitative && indicator?.qualitative_levels && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Qualitative Rubric</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {indicator.qualitative_levels.length > 0 ? (
                    indicator.qualitative_levels.map((level) => (
                      <tr key={level.level} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900 font-medium">{level.level}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{level.label}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{level.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm text-gray-500 text-center">
                        No qualitative rubric defined for this indicator.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Levels Guide for quantitative */}
        {!isQualitative && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Levels Guide</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Range</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPerformanceLevels(indicator).map((level) => (
                    <tr key={level.rating} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900 font-medium">{level.rating}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{level.level}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{level.range}</td>
                      <td className="px-4 py-2 text-sm text-teal-600 font-medium">{level.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PreviewModal;