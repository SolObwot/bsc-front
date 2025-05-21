import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import StrategicObjectiveForm from './StrategicObjectiveForm';

const AddStrategicObjective = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perspectives, setPerspectives] = useState([]);
  const [departments, setDepartments] = useState([]);
  
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
      
      // Redirect to the list page after successful creation
      navigate('/performance/strategic-objectives');
    } catch (err) {
      console.error("Error creating strategic objective:", err);
      throw err;
    }
  };
  
  const handleCancel = () => {
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
          <h1 className="text-xl font-bold text-gray-800">Add Strategic Objective</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create a new strategic objective for your organization
          </p>
        </div>
        <OverallProgress progress={85} riskStatus={false} />
      </div>
      
      <div className="px-4 py-6 bg-white">
        <StrategicObjectiveForm
          perspectives={perspectives}
          departments={departments}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddStrategicObjective;
