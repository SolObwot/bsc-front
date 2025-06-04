import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import StrategicObjectiveForm from './StrategicObjectiveForm';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DeleteObjectiveModal from './DeleteObjectiveModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStrategicObjective, updateStrategicObjective, deleteStrategicObjective, fetchStrategicObjectives } from '../../../redux/strategicObjectiveSlice';
import { useToast } from "../../../hooks/useToast";

const EditStrategicObjective = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id } = useParams();
  
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal is open by default
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  // Get current objective and all objectives from Redux store
  const { currentObjective, loading, error, data } = useSelector((state) => state.strategicObjectives);
  const objectives = data?.flattenedObjectives || [];
  
  // Extract unique perspectives
  const perspectives = objectives
    .map(obj => obj.perspective)
    .filter((perspective, index, self) => 
      perspective && self.findIndex(p => p?.id === perspective?.id) === index
    );
  
  // Fetch the objective data when component mounts
  useEffect(() => {
    // Fetch both the specific objective and all objectives to get perspectives
    dispatch(fetchStrategicObjective(id));
    dispatch(fetchStrategicObjectives());
    
    // Fetch departments
    const fetchData = async () => {
      try {
        // Mock data for departments only
        const mockDepartments = [
          { id: 1, name: "Information Technology" },
          { id: 2, name: "Finance" },
          { id: 3, name: "Human Resources" },
          { id: 4, name: "Marketing" },
          { id: 5, name: "Operations" },
          { id: 6, name: "Business Technology Department" }
        ];
        
        setDepartments(mockDepartments);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    
    fetchData();
  }, [dispatch, id]);
  
  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateStrategicObjective({ id, formData })).unwrap();
      toast({
        title: "Success",
        description: "Strategic objective updated successfully",
        variant: "success",
      });
      closeModal();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update strategic objective",
        variant: "destructive",
      });
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/performance/strategic-objectives');
  };
  
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async (objective) => {
    try {
      await dispatch(deleteStrategicObjective(objective.id)).unwrap();
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Strategic objective deleted successfully",
        variant: "success",
      });
      navigate('/performance/strategic-objectives');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete strategic objective",
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
                  <div className="bg-blue-50 px-6 py-5 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-semibold text-gray-800">
                        Edit Strategic Objective
                      </Dialog.Title>
                      <button onClick={closeModal} className="hover:bg-blue-100 rounded-full p-2">
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    {currentObjective ? (
                      <>
                        <StrategicObjectiveForm
                          initialData={{
                            name: currentObjective.objective?.name || currentObjective.name || '',
                            strategy_perspective_id: currentObjective.strategy_perspective_id || currentObjective.perspective?.id || '',
                            department_id: currentObjective.department_id || ''
                          }}
                          perspectives={perspectives}
                          departments={departments}
                          onSubmit={handleSubmit}
                          onCancel={closeModal}
                          isModal={true}
                        />
                      </>
                    ) : (
                      <div className="text-center py-4">
                        No objective data available. The API might have returned an empty response.
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {/* <button
                        onClick={handleDelete}
                        className="inline-flex items-center justify-center text-sm text-red-600 hover:text-red-800"
                      >
                        Delete this objective
                      </button> */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      <DeleteObjectiveModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        objective={currentObjective}
      />
    </div>
  );
};

export default EditStrategicObjective;
