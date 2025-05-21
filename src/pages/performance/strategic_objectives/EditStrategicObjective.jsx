import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import StrategicObjectiveForm from './StrategicObjectiveForm';

const EditStrategicObjective = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [objective, setObjective] = useState(null);
  const [perspectives, setPerspectives] = useState([]);
  const [departments, setDepartments] = useState([]);
  
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
          description: "Focus on improving effectiveness measures across the organization",
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
      
      // Redirect to the list page after successful update
      navigate('/performance/strategic-objectives');
    } catch (err) {
      console.error("Error updating strategic objective:", err);
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
          <h1 className="text-xl font-bold text-gray-800">Edit Strategic Objective</h1>
          <p className="text-sm text-gray-600 mt-1">
            Update details for this strategic objective
          </p>
        </div>
        <OverallProgress progress={85} riskStatus={false} />
      </div>
      
      <div className="px-4 py-6 bg-white">
        <StrategicObjectiveForm
          initialData={objective}
          perspectives={perspectives}
          departments={departments}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditStrategicObjective;
