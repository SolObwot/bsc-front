import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { deletePerformanceMeasure, fetchPerformanceMeasureById } from '../../../redux/performanceMeasureSlice';
import { useToast } from '../../../hooks/useToast';

const DeletePerformanceMeasure = ({ isOpen, closeModal, performanceMeasureId, prevObjectives, onDataChange }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { selectedPerformanceMeasure, loading, error } = useSelector((state) => state.performanceMeasure);

  useEffect(() => {
    if (performanceMeasureId) {
      dispatch(fetchPerformanceMeasureById(performanceMeasureId));
    }
  }, [dispatch, performanceMeasureId]);

  const handleDelete = async () => {
    try {
      const result = await dispatch(deletePerformanceMeasure(performanceMeasureId)).unwrap();

    if (onDataChange && prevObjectives) {
      const updatedObjectives = prevObjectives.map((objective) => ({
        ...objective,
        subObjectives: objective.subObjectives.map((subObj) => ({
        ...subObj,
        indicators: subObj.indicators.filter((ind) => ind.id !== result), // Remove only the deleted indicator
        })),
      }));
      onDataChange(updatedObjectives); // Pass the updated objectives directly
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

  if (loading.fetchSingle) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <div className="fixed inset-0 bg-black/25" />
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p>Loading...</p>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  if (!selectedPerformanceMeasure) {
    return null;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <Dialog.Title className="text-lg font-semibold text-gray-700">
                      Delete Performance Measure
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-gray-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete this performance measure? This action cannot be undone.
                  </p>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">Performance Details</h3>
                    <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
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
                </div>

                <div className="px-6 py-4 flex justify-end space-x-3 border-t">
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeletePerformanceMeasure;