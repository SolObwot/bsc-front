import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartmentWeight, updateDepartmentWeight, deleteDepartmentWeight, fetchDepartmentWeights } from '../../../redux/strategyPerspectiveSlice';
import { useToast } from '../../../hooks/useToast';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import StrategyPerspectiveForm from './StrategyPerspectiveForm';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DeleteWeightModal from './DeleteWeightModal';

const EditStrategyPerspective = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal is open by default
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { currentWeight, departments, loading, error } = useSelector((state) => state.strategyPerspective);
  
  // Fetch the weight data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchDepartmentWeight(id));
      dispatch(fetchDepartmentWeights());
    }
  }, [dispatch, id]);
  
  // Extract unique perspectives from all department weights
  const allPerspectives = useSelector(state => {
    const perspectivesMap = new Map();
    
    const { departments } = state.strategyPerspective;
    
    departments.forEach(dept => {
      if (dept.active_weights) {
        dept.active_weights.forEach(weight => {
          if (weight.perspective) {
            perspectivesMap.set(weight.perspective.id, weight.perspective);
          }
        });
      }
    });
    
    return Array.from(perspectivesMap.values());
  });
  
  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateDepartmentWeight({ 
        id, 
        formData
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Perspective weight updated successfully",
        variant: "success",
      });
      
      closeModal();
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update perspective weight",
        variant: "destructive",
      });
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/performance/strategic-perspectives');
  };
  
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async (weight) => {
    try {
      await dispatch(deleteDepartmentWeight(weight.id)).unwrap();
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Perspective weight deleted successfully",
        variant: "success",
      });
      navigate('/performance/strategic-perspectives');
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete perspective weight",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <Transition appear show={isModalOpen} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="bg-teal-50 px-6 py-5 border-b border-teal-100">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-semibold text-gray-800">
                        Edit Perspective Weight
                      </Dialog.Title>
                      <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    {currentWeight ? (
                      <>
                        <StrategyPerspectiveForm
                          initialData={{
                            department_id: currentWeight.department_id || '',
                            strategy_perspective_id: currentWeight.strategy_perspective_id || '',
                            weight: currentWeight.weight || ''
                          }}
                          perspectives={allPerspectives}
                          departments={departments}
                          onSubmit={handleSubmit}
                          onCancel={closeModal}
                          isModal={true}
                        />
                      </>
                    ) : (
                      <div className="text-center py-4">
                        No weight data available. The API might have returned an empty response.
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleDelete}
                        className="inline-flex items-center justify-center text-sm text-red-600 hover:text-red-800"
                      >
                        Delete this weight assignment
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      <DeleteWeightModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        weight={currentWeight}
      />
    </div>
  );
};

export default EditStrategyPerspective;
