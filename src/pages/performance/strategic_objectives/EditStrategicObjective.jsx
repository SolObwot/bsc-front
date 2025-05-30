import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import StrategicObjectiveForm from './StrategicObjectiveForm';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EditStrategicObjective = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [objective, setObjective] = useState(null);
  const [perspectives, setPerspectives] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal is open by default
  
  // Fetch data for the form
  useEffect(() => {
    // In a real application, you would fetch from your API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock perspectives data
        const mockPerspectives = [
          {
            id: 1,
            name: "INNOVATION, LEARNING & GROWTH",
            short_code: "SP001",
            type: "quantitative",
            weight: 20
          },
          {
            id: 2,
            name: "INTERNAL PROCESSES",
            short_code: "SP002",
            type: "quantitative",
            weight: 20
          },
          {
            id: 3,
            name: "FINANCIAL",
            short_code: "SP003",
            type: "quantitative",
            weight: 20
          },
          {
            id: 4,
            name: "CUSTOMER",
            short_code: "SP004",
            type: "quantitative",
            weight: 20
          },
          {
            id: 5,
            name: "INTEGRITY & ACCOUNTABILITY",
            short_code: "SP005",
            type: "qualitative",
            weight: 4
          },
          {
            id: 6,
            name: "CUSTOMER CENTRICITY",
            short_code: "SP006",
            type: "qualitative",
            weight: 4
          },
          {
            id: 7,
            name: "TEAMWORK & COLLABORATION",
            short_code: "SP007",
            type: "qualitative",
            weight: 4
          },
          {
            id: 8,
            name: "EFFICIENCY & EFFECTIVENESS",
            short_code: "SP008",
            type: "qualitative",
            weight: 4
          },
          {
            id: 9,
            name: "FAIRNESS & TRANSPARENCY",
            short_code: "SP009",
            type: "qualitative",
            weight: 4
          }
        ];
        
        // Mock departments data
        const mockDepartments = [
          { id: 1, name: "Information Technology" },
          { id: 2, name: "Finance" },
          { id: 3, name: "Human Resources" },
          { id: 4, name: "Marketing" },
          { id: 5, name: "Operations" },
          { id: 6, name: "Business Technology Department" }
        ];
        
        // Mock objective data
        const mockObjective = {
          id: parseInt(id),
          name: "Enhance effectiveness measures",
          perspective_id: 1,
          department_id: 6,
          status: "approved"
        };
        
        setPerspectives(mockPerspectives);
        setDepartments(mockDepartments);
        setObjective(mockObjective);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load objective data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleSubmit = async (formData) => {
    try {
      // In a real application, you would call your API to update the objective
      console.log("Updating strategic objective:", formData);
      
      // Close the modal and redirect to the list page after successful update
      closeModal();
    } catch (err) {
      console.error("Error updating strategic objective:", err);
      throw err;
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    // Navigate back to the list
    navigate('/performance/strategic-objectives');
  };
  
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      {/* Modal for editing strategic objective */}
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
                    <StrategicObjectiveForm
                      initialData={objective}
                      perspectives={perspectives}
                      departments={departments}
                      onSubmit={handleSubmit}
                      onCancel={closeModal}
                      isModal={true}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default EditStrategicObjective;
