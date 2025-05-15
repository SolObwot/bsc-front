import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import ObjectiveTabs from '../../../components/balancescorecard/Tabs';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import InfoBanner from '../../../components/balancescorecard/InfoBanner';
import ObjectiveListHeader from '../../../components/balancescorecard/ListHeader';
import ObjectiveItem from '../../../components/balancescorecard/Item';
import AgreementForm from './AgreementForm';

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

const AddAgreement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('active');
  const [objectives, setObjectives] = useState({
    quantitative: quantitativeObjectives,
    qualitative: qualitativeObjectives
  });
  
  // Form handlers
  const formRef = useRef();

  // Helper function to get the current form handlers
  const getFormHandlers = () => {
    return formRef.current ? {
      handleStrategicModalOpen: (objective) => 
        formRef.current.handleStrategicModalOpen(objective),
      
      handleIndicatorModalOpen: (objective, strategicObjective, indicator, isEdit) => 
        formRef.current.handleIndicatorModalOpen(objective, strategicObjective, indicator, isEdit),
      
      handleAppraisalModalOpen: (indicator, index, indicators) => 
        formRef.current.handleAppraisalModalOpen(indicator, index, indicators),
      
      handleApprovalModalOpen: (indicator, index, indicators) => 
        formRef.current.handleApprovalModalOpen(indicator, index, indicators),
      
      handleActionSelect: (action, objective) => 
        formRef.current.handleActionSelect(action, objective),
      
      handleIndicatorEdit: (indicator, index, indicators) => 
        formRef.current.handleIndicatorEdit(indicator, index, indicators)
    } : {};
  };

  // Handle data changes from AgreementForm
  const handleDataChange = (newObjectives) => {
    if (activeTab === 'active') {
      setObjectives(prev => ({
        ...prev,
        quantitative: newObjectives
      }));
    } else {
      setObjectives(prev => ({
        ...prev,
        qualitative: newObjectives
      }));
    }
  };

  const handleIndicatorEdit = (indicator, index, indicators) => {
    if (formRef.current && formRef.current.handleIndicatorEdit) {
      const parentObjective = findParentObjective(indicator);
      if (parentObjective) {
        formRef.current.handleIndicatorModalOpen(
          findMainObjective(indicator), 
          parentObjective, 
          indicator, 
          true
        );
      } else {
        console.error('Could not find parent objective for indicator:', indicator);
      }
    }
  };

  // Helper function to find the parent strategic objective for an indicator
  const findParentObjective = (indicator) => {
    for (const objective of displayedObjectives) {
      for (const subObj of objective.subObjectives) {
        if (subObj.indicators.some(ind => ind.id === indicator.id)) {
          return subObj;
        }
      }
    }
    return null;
  };

  // Helper function to find the main objective
  const findMainObjective = (indicator) => {
    for (const objective of displayedObjectives) {
      for (const subObj of objective.subObjectives) {
        if (subObj.indicators.some(ind => ind.id === indicator.id)) {
          return objective;
        }
      }
    }
    return null;
  };

  // Get current objectives based on active tab
  const displayedObjectives = activeTab === 'active' 
    ? objectives.quantitative 
    : objectives.qualitative;

  // Store handlers reference
  const handlers = getFormHandlers();

  return (
    <div className="min-h-screen bg-gray-100 shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between">
        <ObjectiveTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <OverallProgress progress={25} riskStatus={true} />
      </div>
      <InfoBanner />
      <ObjectiveListHeader activeTab={activeTab} />
      
      <div className="px-4 py-2">
        {displayedObjectives.map((objective, index) => (
          <ObjectiveItem 
            key={index} 
            objective={objective}
            subObjectives={objective.subObjectives || []}
            
            showAddStrategicButton={false}
            showAddKPIButton={true}
            addKPIButtonLabel="Add Performance Indicator"
            showTargetValue={true}
            
            displayMode={activeTab === 'active' ? 'standard' : 'direct-indicators'}
            isQualitative={activeTab !== 'active'}
            
            onAddKPIClick={(strategicObjective) => 
              handlers.handleIndicatorModalOpen && handlers.handleIndicatorModalOpen(objective, strategicObjective)
            }
            onActionSelect={(action) => 
              handlers.handleActionSelect && handlers.handleActionSelect(action, objective)
            }
            onIndicatorClick={(indicator, index, indicators) => 
              handlers.handleAppraisalModalOpen && handlers.handleAppraisalModalOpen(indicator, index, indicators || [])
            }
            onIndicatorEdit={handleIndicatorEdit}
            onIndicatorDelete={(indicator, index, indicators) => 
              handlers.handleApprovalModalOpen && handlers.handleApprovalModalOpen(indicator, index, indicators || [])
            }
            onStrategicObjectiveEdit={(objective) => 
              handlers.handleApprovalModalOpen && handlers.handleApprovalModalOpen(objective, 0, [])
            }
            
            renderStrategicModal={false}
            renderIndicatorModal={false}
            renderAppraisalModal={false}
            renderAppraisalApprovalModal={false}
          />
        ))}
      </div>

      {/* Use AgreementForm for modal handling and data management */}
      <AgreementForm
        objectives={displayedObjectives}
        isQualitative={activeTab !== 'active'}
        onDataChange={handleDataChange}
        ref={formRef}
      />
    </div>
  );
};

export default AddAgreement;
