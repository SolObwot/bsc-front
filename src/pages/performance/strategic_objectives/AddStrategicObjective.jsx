import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import StrategicObjectiveForm from './StrategicObjectiveForm';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';

const AddStrategicObjective = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perspectives, setPerspectives] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch perspectives and departments for the form
  useEffect(() => {
    // In a real application, you would fetch from your API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data based on the provided API response
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
        
        const mockDepartments = [
          { id: 1, name: "Information Technology" },
          { id: 2, name: "Finance" },
          { id: 3, name: "Human Resources" },
          { id: 4, name: "Marketing" },
          { id: 5, name: "Operations" },
          { id: 6, name: "Business Technology Department" }
        ];
        
        setPerspectives(mockPerspectives);
        setDepartments(mockDepartments);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load required data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSubmit = async (formData) => {
    try {
      // In a real application, you would call your API to create the objective
      console.log("Creating strategic objective:", formData);
      
      // Close the modal and redirect to the list page after successful creation
      setIsModalOpen(false);
      navigate('/performance/strategic-objectives');
    } catch (err) {
      console.error("Error creating strategic objective:", err);
      throw err;
    }
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const handleReturnToList = () => {
    navigate('/performance/strategic-objectives');
  };
  
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Strategic Objectives</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage strategic objectives for your organization
          </p>
        </div>
        <OverallProgress progress={85} riskStatus={false} />
      </div>
      
      <div className="px-6 py-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Strategic Objectives</h2>
            <p className="text-gray-600 mb-8">
              Strategic objectives define the key goals your organization aims to achieve.
            </p>
            
            <div className="flex flex-col items-center space-y-4">
              <Button 
                type="button"
                variant="pride"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-6"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Strategic Objective
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={handleReturnToList}
              >
                View All Strategic Objectives
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Strategic Objective Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
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
                        Create Strategic Objective
                      </Dialog.Title>
                      <button onClick={() => setIsModalOpen(false)} className="hover:bg-teal-100 rounded-full p-2">
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    <StrategicObjectiveForm
                      perspectives={perspectives}
                      departments={departments}
                      onSubmit={handleSubmit}
                      onCancel={handleCancel}
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

export default AddStrategicObjective;
