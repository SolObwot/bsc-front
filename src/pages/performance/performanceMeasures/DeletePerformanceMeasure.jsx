import React, { useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deletePerformanceMeasure, fetchPerformanceMeasureById } from '../../../redux/performanceMeasureSlice';
import { useToast } from '../../../hooks/useToast';

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

const DeletePerformanceMeasure = ({ isOpen, closeModal, performanceMeasureId, prevObjectives, onDataChange }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { selectedPerformanceMeasure, loading } = useSelector((state) => state.performanceMeasure);
  
    useEffect(() => {
      if (performanceMeasureId) {
        dispatch(fetchPerformanceMeasureById(performanceMeasureId));
      }
    }, [dispatch, performanceMeasureId]);
  
    const handleDelete = async () => {
      try {
        const result = await dispatch(deletePerformanceMeasure(performanceMeasureId)).unwrap();
  
        if (onDataChange && Array.isArray(prevObjectives)) {
          const updatedObjectives = prevObjectives.map((objective) => ({
            ...objective,
            subObjectives: objective.subObjectives.map((subObj) => ({
              ...subObj,
              indicators: subObj.indicators.filter((ind) => ind.id !== result),
            })),
          }));
          onDataChange(updatedObjectives);
        }
  
        toast({
          title: "Success",
          description: "Performance measure deleted successfully.",
        });
        closeModal();
      } catch (error) {
        console.error("Error deleting performance measure:", error);
        toast({
          title: "Error",
          description: "Failed to delete performance measure. Please try again.",
          variant: "destructive",
        });
      }
    };
  
    if (!selectedPerformanceMeasure) {
      return null;
    }
  
    const performanceLevels = [
      {
        rating: 5,
        level: "Outstanding",
        range: `Greater than ${selectedPerformanceMeasure.outstanding_threshold}`,
        weight: selectedPerformanceMeasure.outstanding_threshold,
      },
      {
        rating: 4,
        level: "Exceeds Expectations",
        range: `${selectedPerformanceMeasure.exceeds_expectations_threshold}-${selectedPerformanceMeasure.outstanding_threshold}`,
        weight: selectedPerformanceMeasure.exceeds_expectations_threshold,
      },
      {
        rating: 3,
        level: "Meets Expectations",
        range: `${selectedPerformanceMeasure.meets_expectations_threshold}`,
        weight: selectedPerformanceMeasure.meets_expectations_threshold,
      },
      {
        rating: 2,
        level: "Needs Improvement",
        range: `${selectedPerformanceMeasure.needs_improvement_threshold}-${selectedPerformanceMeasure.meets_expectations_threshold}`,
        weight: selectedPerformanceMeasure.needs_improvement_threshold,
      },
      {
        rating: 1,
        level: "Unsatisfactory",
        range: `Less than ${selectedPerformanceMeasure.needs_improvement_threshold}`,
        weight: selectedPerformanceMeasure.unsatisfactory_threshold,
      },
    ];
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Delete Performance Measure"
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this performance measure? This action cannot be undone.
          </p>
  
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-900">Performance Details</h3>
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedPerformanceMeasure.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Target Value</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedPerformanceMeasure.target_value}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Measurement Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{selectedPerformanceMeasure.measurement_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedPerformanceMeasure.net_weight}%</dd>
              </div>
            </dl>
          </div>
  
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
                  {performanceLevels.map((level) => (
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
        </div>
      </Modal>
    );
  };
  
  export default DeletePerformanceMeasure;