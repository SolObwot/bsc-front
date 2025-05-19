import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import ObjectiveTabs from '../../../components/balancescorecard/Tabs';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import InfoBanner from '../../../components/balancescorecard/InfoBanner';
import ObjectiveListHeader from '../../../components/balancescorecard/ListHeader';
import ObjectiveItem from '../../../components/balancescorecard/Item';
import AppraisalModal from '../../../components/balancescorecard/modals/AppraisalModal';
import Button from '../../../components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';

// Helper function to generate random target values based on measurement type
const generateTargetValue = (indicatorName, forceMeasurementType = null) => {
  let measurementType = forceMeasurementType || 'number';
  
  if (!forceMeasurementType) {
    if (indicatorName.toLowerCase().includes('percentage') || 
        indicatorName.toLowerCase().includes('rate') || 
        indicatorName.toLowerCase().includes('%')) {
      measurementType = 'percentage';
    } else if (indicatorName.toLowerCase().includes('cost') || 
        indicatorName.toLowerCase().includes('revenue') || 
        indicatorName.toLowerCase().includes('profit') ||
        indicatorName.toLowerCase().includes('margin')) {
      measurementType = 'currency';
    }
  }
  
  switch(measurementType) {
    case 'percentage':
      return { 
        targetValue: Math.floor(Math.random() * 100), 
        measurementType 
      };
    case 'currency':
      return { 
        targetValue: Math.floor(Math.random() * 10000) * 1000, 
        measurementType 
      };
    case 'date':
      const today = new Date();
      const randomDays = Math.floor(Math.random() * 365);
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + randomDays);
      return { 
        targetValue: targetDate, 
        measurementType 
      };
    case 'number':
    default:
      return { 
        targetValue: Math.floor(Math.random() * 100), 
        measurementType 
      };
  }
};

const addTargetValuesToIndicators = (objectives) => {
  const dateIndicators = [
    "Project completion date", 
    "System upgrade deadline", 
    "Compliance report submission",
    "Training program completion",
    "Implementation deadline"
  ];
  
  return objectives.map(objective => {
    const subObjectivesWithTargets = objective.subObjectives.map(subObj => {
      const indicatorsWithTargets = subObj.indicators.map(indicator => {
        let forceMeasurementType = null;
        
        if (dateIndicators.some(keyword => indicator.name.toLowerCase().includes(keyword.toLowerCase()))) {
          forceMeasurementType = 'date';
        }
        
        if ([104, 204, 105, 205].includes(indicator.id)) {
          forceMeasurementType = 'date';
        }
        
        const { targetValue, measurementType } = generateTargetValue(
          indicator.name, 
          forceMeasurementType
        );
        
        return {
          ...indicator,
          targetValue,
          measurementType
        };
      });
      
      return {
        ...subObj,
        indicators: indicatorsWithTargets
      };
    });
    
    return {
      ...objective,
      subObjectives: subObjectivesWithTargets
    };
  });
};

const quantitativeObjectives = addTargetValuesToIndicators([
  {
    title: 'FINANCIAL Perspective',
    totalWeight: '15%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Derrick Katamba',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2024',
    created: 'Oct 10, 2023',
    keyResults: 0,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      {
        id: 1,
        name: "Increase revenue growth",
        weight: "5%",
        indicators: [
          { id: 101, name: "Quarterly revenue growth percentage compared to previous year", weight: "2.5%" },
          { id: 102, name: "New customer acquisition rate", weight: "2.5%" },
          { id: 103, name: "Cross-selling of products to existing customers", weight: "1.5%" },
          { id: 104, name: "Project completion date for revenue growth initiatives", weight: "1.5%" }
        ]
      },
      {
        id: 2,
        name: "Improve profit margins",
        weight: "5%",
        indicators: [
          { id: 201, name: "Net profit margin percentage", weight: "2%" },
          { id: 202, name: "Cost-to-income ratio", weight: "3%" },
          { id: 203, name: "Return on equity (ROE)", weight: "1.5%" }
        ]
      },
      {
        id: 3,
        name: "Enhance cost efficiency",
        weight: "5%",
        indicators: [
          { id: 301, name: "Operational expenses as percentage of income", weight: "2.5%" },
          { id: 302, name: "Cost per transaction", weight: "2.5%" },
          { id: 303, name: "Staff cost as percentage of total operational cost", weight: "1.5%" }
        ]
      }
    ]
  },
  {
    title: 'CUSTOMER Perspective',
    totalWeight: '20%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Derrick Katamba',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2024',
    created: 'Oct 10, 2023',
    keyResults: 2,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      {
        id: 1,
        name: "To stabilize the system",
        weight: "10%",
        indicators: [
          { id: 101, name: "System uptime percentage (target: 99.9%)", weight: "5%" },
          { id: 102, name: "Average system response time in seconds", weight: "3%" },
          { id: 103, name: "Number of reported system issues per month", weight: "2%" },
          { id: 104, name: "System upgrade deadline date", weight: "2%" }
        ]
      },
      {
        id: 2,
        name: "Increase Savers & Borrowers while Improving on customer experience and attain a Net Promoters Score of 50%",
        weight: "10%",
        indicators: [
          { id: 201, name: "Net Promoter Score (target: 50%)", weight: "3%" },
          { id: 202, name: "Growth in active savings accounts", weight: "2%" },
          { id: 203, name: "Growth in approved loan applications", weight: "2%" },
          { id: 204, name: "Customer satisfaction rate from feedback surveys", weight: "3%" }
        ]
      }
    ]
  },
  {
    title: 'INTERNAL PROCESSES',
    totalWeight: '45%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Derrick Katamba',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2024',
    created: 'Oct 10, 2023',
    keyResults: 1,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      {
        id: 1,
        name: "Improve Institutional Compliance levels",
        weight: "15%",
        indicators: [
          { id: 101, name: "Percentage of regulatory requirements met within deadlines", weight: "5%" },
          { id: 102, name: "Number of compliance violations reported", weight: "5%" },
          { id: 103, name: "Completion rate of compliance training programs", weight: "3%" },
          { id: 104, name: "Successful completion of internal audit with minimal findings", weight: "2%" },
          { id: 105, name: "Compliance report submission date", weight: "2%" }
        ]
      },
      {
        id: 2,
        name: "Enhance operational efficiency",
        weight: "15%",
        indicators: [
          { id: 201, name: "Average loan processing time in days", weight: "5%" },
          { id: 202, name: "Percentage reduction in customer onboarding time", weight: "4%" },
          { id: 203, name: "Percentage of transactions processed through digital channels", weight: "3%" },
          { id: 204, name: "Reduction in manual processing errors", weight: "3%" }
        ]
      },
      {
        id: 3,
        name: "Optimize process workflows",
        weight: "15%",
        indicators: [
          { id: 301, name: "Number of processes automated or optimized", weight: "5%" },
          { id: 302, name: "Percentage reduction in paperwork and manual documentation", weight: "5%" },
          { id: 303, name: "Implementation of standard operating procedures for key processes", weight: "3%" },
          { id: 304, name: "Percentage improvement in process cycle time", weight: "2%" }
        ]
      }
    ]
  },
  {
    title: 'INNOVATION, LEARNING & GROWTH',
    totalWeight: '20%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Derrick Katamba',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2024',
    created: 'Oct 10, 2023',
    keyResults: 1,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      {
        id: 1,
        name: "To grow capacity of staff to be able to efficiently support sustained growth of the Pride",
        weight: "10%",
        indicators: [
          { id: 101, name: "Percentage of staff completing advanced skills training", weight: "3%" },
          { id: 102, name: "Number of cross-trained employees per department", weight: "2%" },
          { id: 103, name: "Implementation of succession planning for key positions", weight: "3%" },
          { id: 104, name: "Staff productivity metrics improvement percentage", weight: "2%" }
        ]
      },
      {
        id: 2,
        name: "Develop employee skills and competencies",
        weight: "10%",
        indicators: [
          { id: 201, name: "Average training hours per employee", weight: "3%" },
          { id: 202, name: "Percentage improvement in skills assessment scores", weight: "3%" },
          { id: 203, name: "Number of employees attaining professional certifications", weight: "2%" },
          { id: 204, name: "Successful implementation of mentorship programs", weight: "2%" },
          { id: 205, name: "Training program completion date", weight: "2%" }
        ]
      }
    ]
  },
]);

const qualitativeObjectives = [
  {
    title: 'Customer Centricity',
    totalWeight: '2%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Derrick Katamba',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2024',
    created: 'Oct 10, 2023',
    keyResults: 1,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      {
        id: 1,
        name: "Ability to follow up on customer issues while providing feedback in a timely manner",
        weight: "2%",
        indicators: [
          { id: 101, name: "Ability to follow up on customer issues while providing feedback in a timely manner", weight: "2%" }
        ]
      }
    ]
  },
  {
    title: 'Integrity & Accountability',
    totalWeight: '2%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Derrick Katamba',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2024',
    created: 'Oct 10, 2023',
    keyResults: 1,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      {
        id: 1,
        name: "Ability to remain morally upright, respect and uphold the guidelines and procedures as well as taking responsibility for individual actions",
        weight: "2%",
        indicators: [
          { id: 101, name: "Ability to remain morally upright, respect and uphold the guidelines and procedures as well as taking responsibility for individual actions", weight: "2%" }
        ]
      }
    ]
  },
  {
    title: 'Teamwork & Collaboration',
    totalWeight: '2%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Derrick Katamba',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2024',
    created: 'Oct 10, 2023',
    keyResults: 1,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      {
        id: 1,
        name: "Actively and consistently participates in team activities and shares information in an open manner respecting views of others",
        weight: "2%",
        indicators: [
          { id: 101, name: "Actively and consistently participates in team activities and shares information in an open manner respecting views of others", weight: "2%" }
        ]
      }
    ]
  },
  {
    title: 'Fairness & Transparency',
    totalWeight: '2%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Derrick Katamba',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2024',
    created: 'Oct 10, 2023',
    keyResults: 1,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      {
        id: 1,
        name: "Degree of impartiality & sincerity while executing daily tasks",
        weight: "2%",
        indicators: [
          { id: 101, name: "Degree of impartiality & sincerity while executing daily tasks", weight: "2%" }
        ]
      }
    ]
  },
  {
    title: 'Efficiency & Effectiveness',
    totalWeight: '2%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Derrick Katamba',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2024',
    created: 'Oct 10, 2023',
    keyResults: 1,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      {
        id: 1,
        name: "Ability to consistently deliver on assignments in a timely manner without errors, using available resources",
        weight: "2%",
        indicators: [
          { id: 101, name: "Ability to consistently deliver on assignments in a timely manner without errors, using available resources", weight: "2%" }
        ]
      }
    ]
  }
];

// Mock data for appraisals - kept for compatibility
const mockAppraisals = [
  {
    id: 1,
    agreementTitle: 'Performance Agreement 2025',
    agreementId: 1,
    period: 'Annual Review',
    createdDate: '2025-05-01',
    submittedDate: null,
    status: 'pending_rating',
    indicators: [
      { id: 101, name: "Revenue Growth Rate", targetValue: "15%", actualValue: "", weight: "15%", selfRating: "", supervisorRating: "", measurementType: "percentage" },
      { id: 102, name: "Customer Satisfaction Score", targetValue: "4.5", actualValue: "", weight: "10%", selfRating: "", supervisorRating: "", measurementType: "number" },
      { id: 103, name: "Employee Retention Rate", targetValue: "90%", actualValue: "", weight: "10%", selfRating: "", supervisorRating: "", measurementType: "percentage" }
    ]
  },
];

const RateAppraisalPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('active');
  const [appraisal, setAppraisal] = useState(null);
  
  // Use the same objective structure as AddAgreement.jsx
  const [objectives, setObjectives] = useState({
    quantitative: quantitativeObjectives,
    qualitative: qualitativeObjectives
  });
  
  // Modal states
  const [isAppraisalModalOpen, setIsAppraisalModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [currentIndicatorIndex, setCurrentIndicatorIndex] = useState(0);
  const [currentIndicatorsList, setCurrentIndicatorsList] = useState([]);
  
  // Progress tracking
  const [totalProgress, setTotalProgress] = useState(0);

  // Load appraisal data based on ID and populate objectives
  useEffect(() => {
    // Find appraisal in mockAppraisals
    const foundAppraisal = mockAppraisals.find(a => a.id.toString() === id);
    if (foundAppraisal) {
      setAppraisal(foundAppraisal);
      
      // Calculate progress of rated indicators
      const ratedCount = foundAppraisal.indicators.filter(i => i.selfRating).length;
      const progress = Math.round((ratedCount / foundAppraisal.indicators.length) * 100);
      setTotalProgress(progress);
      
      // Create a map of all indicators from the appraisal
      const appraisalIndicators = foundAppraisal.indicators.map(ind => ({
        ...ind,
        selfRating: ind.selfRating || "",
        actualValue: ind.actualValue || ""
      }));
      
      // Merge appraisal indicators with the objective structure
      const updatedQuantitativeObjectives = quantitativeObjectives.map(objective => ({
        ...objective,
        progress: progress,
        assignee: {
          name: foundAppraisal.employeeName || 'Current User',
          avatar: '/placeholder.svg',
        },
        subObjectives: objective.subObjectives.map(subObj => ({
          ...subObj,
          indicators: subObj.indicators.map(indicator => {
            // Try to find matching indicator in appraisal
            const matchingInd = appraisalIndicators.find(ai => 
              ai.name.toLowerCase().includes(indicator.name.toLowerCase()) ||
              indicator.name.toLowerCase().includes(ai.name.toLowerCase())
            );
            
            return matchingInd ? {
              ...indicator,
              ...matchingInd,
              // Ensure these fields are present
              actualValue: matchingInd.actualValue || "",
              selfRating: matchingInd.selfRating || ""
            } : indicator;
          })
        }))
      }));
      
      // Update qualitative objectives similarly
      const updatedQualitativeObjectives = qualitativeObjectives.map(objective => ({
        ...objective,
        progress: progress,
        assignee: {
          name: foundAppraisal.employeeName || 'Current User',
          avatar: '/placeholder.svg',
        }
      }));
      
      setObjectives({
        quantitative: updatedQuantitativeObjectives,
        qualitative: updatedQualitativeObjectives
      });
    } else {
      // Handle case when appraisal is not found
      navigate('/performance/rating/self');
    }
  }, [id, navigate]);
  
  // Get current objectives based on active tab
  const displayedObjectives = activeTab === 'active' 
    ? objectives.quantitative 
    : objectives.qualitative;

  // Handle indicator rating (open AppraisalModal)
  const handleIndicatorRating = (indicator, index, indicators) => {
    setSelectedIndicator(indicator);
    setCurrentIndicatorIndex(index);
    setCurrentIndicatorsList(indicators);
    setIsAppraisalModalOpen(true);
  };
  
  // Handle navigation between indicators within the modal
  const handleIndicatorNavigation = (direction) => {
    let nextIndex = currentIndicatorIndex;
    if (direction === 'next' && currentIndicatorIndex < currentIndicatorsList.length - 1) {
      nextIndex = currentIndicatorIndex + 1;
    } else if (direction === 'prev' && currentIndicatorIndex > 0) {
      nextIndex = currentIndicatorIndex - 1;
    }
    setCurrentIndicatorIndex(nextIndex);
    setSelectedIndicator(currentIndicatorsList[nextIndex]);
  };
  
  // Save rating from the modal
  const handleSaveRating = (updatedIndicator) => {
    // Update the indicator in our local state
    const tabType = activeTab === 'active' ? 'quantitative' : 'qualitative';
    
    const updatedObjectiveSet = objectives[tabType].map(objective => ({
      ...objective,
      subObjectives: objective.subObjectives.map(subObj => ({
        ...subObj,
        indicators: subObj.indicators.map(ind => 
          ind.id === updatedIndicator.id 
            ? { 
                ...ind, 
                actualValue: updatedIndicator.actualValue, 
                selfRating: updatedIndicator.selfRating 
              } 
            : ind
        )
      }))
    }));
    
    setObjectives({
      ...objectives,
      [tabType]: updatedObjectiveSet
    });
    
    // Also update the main appraisal object
    if (appraisal) {
      const updatedAppraisal = {
        ...appraisal,
        indicators: appraisal.indicators.map(ind => 
          ind.id === updatedIndicator.id 
            ? { 
                ...ind, 
                actualValue: updatedIndicator.actualValue, 
                selfRating: updatedIndicator.selfRating 
              } 
            : ind
        ),
        status: 'in_progress' // Update status once rating starts
      };
      setAppraisal(updatedAppraisal);
      
      // Recalculate progress
      const ratedCount = updatedAppraisal.indicators.filter(i => i.selfRating).length;
      const progress = Math.round((ratedCount / updatedAppraisal.indicators.length) * 100);
      setTotalProgress(progress);
    }
    
    setIsAppraisalModalOpen(false);
  };
  
  // Save all changes and return to the self-rating list
  const handleSaveAndExit = () => {
    // In a real app, this would make an API call to save all changes
    // For now, just update our mock data
    if (appraisal) {
      // Find the appraisal in the mock data
      const index = mockAppraisals.findIndex(a => a.id === appraisal.id);
      if (index !== -1) {
        mockAppraisals[index] = appraisal;
      }
    }
    
    // Navigate back to the self-rating list
    navigate('/performance/rating/self');
  };

  // If we don't have appraisal data yet, show a loading state
  if (!appraisal) {
    return <div className="flex items-center justify-center min-h-screen">Loading appraisal data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ObjectiveHeader />
      <div className="flex justify-between items-start px-4 py-4">
        <ObjectiveTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <OverallProgress progress={totalProgress} riskStatus={false} />
      </div>
      
      <div className="px-4 pb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={() => navigate('/performance/rating/self')}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Self-Rating List
          </button>
          {/* <h1 className="text-xl font-bold text-gray-800">
            {appraisal.agreementTitle}
          </h1>
          <span className="text-sm text-gray-600">
            {appraisal.period} | {appraisal.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span> */}
        </div>
        
        {/* <InfoBanner message="Rate your performance against the Key Performance Indicators (KPIs) below. Click the 'Rate' button to provide your self-assessment and actual achieved values." /> */}
        
        <ObjectiveListHeader activeTab={activeTab} />
        
        <div className="mt-4">
          {displayedObjectives.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-600">
                {activeTab === 'active' 
                  ? 'No quantitative objectives found for this appraisal.'
                  : 'No qualitative objectives found for this appraisal.'
                }
              </p>
            </div>
          ) : (
            displayedObjectives.map((objective, index) => (
              <ObjectiveItem 
                key={index} 
                objective={objective}
                subObjectives={objective.subObjectives || []}
                
                showAddStrategicButton={false}
                showAddKPIButton={false}
                showActionDropdown={false}
                
                displayMode="standard"
                isQualitative={activeTab !== 'active'}
                
                showAppraisalButton={true}
                appraisalButtonLabel="Rate"
                onIndicatorClick={handleIndicatorRating}
                
                renderStrategicModal={false}
                renderIndicatorModal={false}
                renderAppraisalModal={false}
                renderAppraisalApprovalModal={false}
              />
            ))
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => navigate('/performance/rating/self')}>
            Cancel
          </Button>
          <Button variant="pride" onClick={handleSaveAndExit}>
            Save All Ratings & Exit
          </Button>
        </div>
      </div>
      
      {/* AppraisalModal for rating indicators */}
      {selectedIndicator && (
        <AppraisalModal 
          isOpen={isAppraisalModalOpen}
          closeModal={() => setIsAppraisalModalOpen(false)}
          indicator={selectedIndicator}
          onNavigate={handleIndicatorNavigation}
          hasNext={currentIndicatorIndex < currentIndicatorsList.length - 1}
          hasPrevious={currentIndicatorIndex > 0}
          totalCount={currentIndicatorsList.length}
          currentIndex={currentIndicatorIndex}
          initialActualValue={selectedIndicator.actualValue}
          initialSelfRating={selectedIndicator.selfRating}
          onSave={handleSaveRating}
        />
      )}
    </div>
  );
};

export default RateAppraisalPage;
