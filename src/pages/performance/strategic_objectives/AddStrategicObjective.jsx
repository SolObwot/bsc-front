import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import { PlusIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';
import CreateObjectiveModal from './CreateObjectiveModal';
import { createStrategicObjective, fetchStrategicObjectives } from '../../../redux/strategicObjectiveSlice';

const AddStrategicObjective = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get perspectives from Redux store
  const { data } = useSelector((state) => state.strategicObjectives);
  const objectives = data?.flattenedObjectives || [];
  
  // Extract unique perspectives
  const perspectives = objectives
    .map(obj => obj.perspective)
    .filter((perspective, index, self) => 
      perspective && self.findIndex(p => p?.id === perspective?.id) === index
    );
  
  // Fetch perspectives and departments for the form
  useEffect(() => {
    // Fetch strategic objectives to get perspectives
    dispatch(fetchStrategicObjectives());
    
    // In a real application, you would fetch departments from your API
    const fetchData = async () => {
      try {
        setLoading(true);
        
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
        setError("Failed to load required data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch]);
  
  const handleSubmit = async (formData) => {
    try {
      // Dispatch the action to create the objective
      const result = await dispatch(createStrategicObjective(formData)).unwrap();
      
      // Close the modal and redirect to the list page after successful creation
      setIsModalOpen(false);
      navigate('/performance/strategic-objectives');
    } catch (err) {
      throw err;
    }
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
      
      {/* Use the separate CreateObjectiveModal component */}
      <CreateObjectiveModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        perspectives={perspectives}
        departments={departments}
      />
    </div>
  );
};

export default AddStrategicObjective;
