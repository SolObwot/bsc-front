import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import Button from '../../../components/ui/Button';
import { ChevronLeftIcon, UserCircleIcon, ClockIcon, BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/20/solid';

const ConfirmationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [formData, setFormData] = useState({});
  const [recommendationOptions] = useState([
    { id: 'confirm', label: 'Confirm Employment' },
    { id: 'extend', label: 'Extend Probation Period' },
    { id: 'terminate', label: 'Terminate Employment' }
  ]);
  
  useEffect(() => {
    // In a real application, fetch the confirmation data by ID
    const fetchConfirmation = async () => {
      try {
        setLoading(true);
        
        // Mock data
        const mockConfirmation = {
          id: parseInt(id),
          employeeName: 'John Smith',
          position: 'Software Engineer',
          department: 'Information Technology',
          branch: 'Head Office',
          probationPeriod: '6 months',
          startDate: '2023-10-15',
          endDate: '2024-04-15',
          submittedDate: '2024-04-01',
          status: 'supervisor_in_progress',
          criteria: [
            { id: 101, name: "Technical Skills", rating: "", comments: "", weight: "25%" },
            { id: 102, name: "Communication", rating: "", comments: "", weight: "15%" },
            { id: 103, name: "Teamwork", rating: "", comments: "", weight: "20%" },
            { id: 104, name: "Initiative", rating: "", comments: "", weight: "15%" },
            { id: 105, name: "Reliability", rating: "", comments: "", weight: "25%" }
          ]
        };
        
        setConfirmation(mockConfirmation);
        
        // Initialize form data with existing ratings and comments
        const initialFormData = {
          recommendation: '',
          comments: '',
          criteria: mockConfirmation.criteria.map(criterion => ({
            id: criterion.id,
            rating: criterion.rating || '',
            comments: criterion.comments || ''
          }))
        };
        
        setFormData(initialFormData);
        
      } catch (err) {
        console.error("Error fetching confirmation:", err);
        setError("Failed to load confirmation data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfirmation();
  }, [id]);
  
  const handleCriteriaChange = (criterionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => 
        c.id === criterionId ? { ...c, [field]: value } : c
      )
    }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    // Save as draft
    console.log("Saving confirmation review:", formData);
    navigate('/performance/confirmation/supervisor');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit for review
    console.log("Submitting confirmation review:", formData);
    navigate('/performance/confirmation/supervisor');
  };
  
  const handleBack = () => {
    navigate('/performance/confirmation/supervisor');
  };
  
  if (loading) {
    return <div className="p-6 text-center">Loading confirmation data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Confirmation Review</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review employee performance during probation period
          </p>
        </div>
        <OverallProgress progress={65} riskStatus={false} />
      </div>
      
      <div className="px-4 py-4 bg-white">
        <button 
          onClick={handleBack}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Confirmation List
        </button>
        
        {/* Employee Information Card */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Employee Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start">
              <UserCircleIcon className="w-5 h-5 mr-2 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Employee</p>
                <p className="text-sm text-gray-900">{confirmation.employeeName}</p>
                <p className="text-xs text-gray-500">{confirmation.position}</p>
              </div>
            </div>
            <div className="flex items-start">
              <BuildingOfficeIcon className="w-5 h-5 mr-2 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Department</p>
                <p className="text-sm text-gray-900">{confirmation.department}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="w-5 h-5 mr-2 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Branch/Unit</p>
                <p className="text-sm text-gray-900">{confirmation.branch}</p>
              </div>
            </div>
            <div className="flex items-start">
              <ClockIcon className="w-5 h-5 mr-2 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Probation Period</p>
                <p className="text-sm text-gray-900">{confirmation.probationPeriod}</p>
                <p className="text-xs text-gray-500">
                  {new Date(confirmation.startDate).toLocaleDateString()} to {new Date(confirmation.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Performance Criteria Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Evaluation</h2>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Criteria</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Weight</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Rating (1-5)</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Comments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {confirmation.criteria.map((criterion, index) => (
                    <tr key={criterion.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-900">{criterion.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{criterion.weight}</td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          value={formData.criteria.find(c => c.id === criterion.id)?.rating || ''}
                          onChange={(e) => handleCriteriaChange(criterion.id, 'rating', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Rating</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Below Average</option>
                          <option value="3">3 - Average</option>
                          <option value="4">4 - Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <input
                          type="text"
                          value={formData.criteria.find(c => c.id === criterion.id)?.comments || ''}
                          onChange={(e) => handleCriteriaChange(criterion.id, 'comments', e.target.value)}
                          placeholder="Enter comments"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Overall Recommendation Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Recommendation</h2>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation</label>
                <select
                  name="recommendation"
                  value={formData.recommendation}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  required
                >
                  <option value="">Select Recommendation</option>
                  {recommendationOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="Provide additional comments or justification for your recommendation"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSave}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="pride"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationForm;
