import React, { useState } from 'react';
import ObjectiveHeader from './Header';
import ObjectiveTabs from './Tabs';
import OverallProgress from './OverallProgress';
import InfoBanner from './InfoBanner';
import ObjectiveItem from './Item';
import ObjectiveListHeader from './ListHeader';

// Integrated sample data with sub-objectives included in each objective
const objectives = [
  {
    title: 'FINANCIAL Perspective',
    totalWeight: '25%',
    progress: 100,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Phillip Ayazika',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 18, 2025',
    created: 'Oct 17, 2024',
    keyResults: 1,
    status: 'Completed',
    comments: 0,
    subObjectives: [
      { 
        id: 1, 
        name: "Increase revenue growth", 
        weight: "15%",
        indicators: [
          { id: 101, name: "Quarterly revenue increase.", weight: "10%" },
          { id: 102, name: "New client acquisition rate.", weight: "5%" },
          { id: 103, name: "Customer lifetime value (CLV)", weight: "5%" }
        ] 
      },
      { 
        id: 2, 
        name: "Improve profit margins", 
        weight: "10%",
        indicators: [
          { id: 201, name: "Gross profit margin", weight: "5%" },
          { id: 202, name: "Operating expense ratio", weight: "5%" }
        ] 
      },
      { 
        id: 3, 
        name: "Enhance cost efficiency", 
        weight: "10%",
        indicators: [
          { id: 301, name: "Cost per unit reduction", weight: "5%" },
          { id: 302, name: "Budget variance percentage", weight: "5%" }
        ] 
      },
      { 
        id: 4, 
        name: "Optimize asset utilization", 
        weight: "10%",
        indicators: [
          { id: 401, name: "Asset turnover ratio", weight: "5%" },
          { id: 402, name: "Return on assets (ROA)", weight: "5%" }
        ] 
      }
    ]
  },
  {
    title: 'CUSTOMER Perspective',
    totalWeight: '25%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Phillip Ayazika',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2025',
    created: 'Oct 10, 2024',
    keyResults: 1,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      { 
        id: 1, 
        name: "Enhance customer satisfaction", 
        weight: "15%",
        indicators: [
          { id: 101, name: "Net Promoter Score (NPS)", weight: "8%" },
          { id: 102, name: "Customer Retention Rate", weight: "7%" }
        ] 
      },
      { 
        id: 2, 
        name: "Expand market share", 
        weight: "10%",
        indicators: [
          { id: 201, name: "Market penetration percentage", weight: "5%" },
          { id: 202, name: "Competitive position index", weight: "5%" }
        ] 
      }
    ]
  },
  {
    title: 'INTERNAL PROCESSES',
    totalWeight: '25%',
    progress: 0,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Phillip Ayazika',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 15, 2025',
    created: 'Oct 10, 2024',
    keyResults: 1,
    status: 'In Progress',
    comments: 0,
    subObjectives: [
      { 
        id: 1, 
        name: "Streamline operational processes", 
        weight: "15%",
        indicators: [
          { id: 101, name: "Process cycle time reduction", weight: "8%" },
          { id: 102, name: "Error rate percentage", weight: "7%" }
        ] 
      },
      { 
        id: 2, 
        name: "Improve supply chain efficiency", 
        weight: "10%",
        indicators: [
          { id: 201, name: "Delivery time performance", weight: "5%" },
          { id: 202, name: "Inventory turnover rate", weight: "5%" }
        ] 
      }
    ]
  },
  {
    title: 'INNOVATION, LEARNING & GROWTH',
    totalWeight: '25%',
    progress: 100,
    dueDate: '31 Dec, 2024',
    assignee: {
      name: 'Phillip Ayazika',
      avatar: '/placeholder.svg',
    },
    lastUpdated: 'Mar 18, 2025',
    created: 'Oct 17, 2024',
    keyResults: 1,
    status: 'Completed',
    comments: 0,
    subObjectives: [
      { 
        id: 1, 
        name: "Enhance employee skills", 
        weight: "15%",
        indicators: [
          { id: 101, name: "Training completion rate", weight: "7%" },
          { id: 102, name: "Skills assessment scores", weight: "8%" }
        ] 
      },
      { 
        id: 2, 
        name: "Foster innovation culture", 
        weight: "10%",
        indicators: [
          { id: 201, name: "New ideas submitted", weight: "5%" },
          { id: 202, name: "Innovation implementation rate", weight: "5%" }
        ] 
      },
      { 
        id: 3, 
        name: "Improve employee engagement", 
        weight: "10%",
        indicators: [
          { id: 301, name: "Employee satisfaction survey", weight: "5%" },
          { id: 302, name: "Employee turnover rate", weight: "5%" }
        ] 
      },
      { 
        id: 4, 
        name: "Develop leadership capabilities", 
        weight: "10%",
        indicators: [
          { id: 401, name: "Leadership training participation", weight: "5%" },
          { id: 402, name: "Leadership effectiveness feedback", weight: "5%" }
        ] 
      }
    ]
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="min-h-screen bg-gray-100 shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between">
        <ObjectiveTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <OverallProgress progress={25} riskStatus={true} />
      </div>
      <InfoBanner />
      <ObjectiveListHeader />
      <div className="px-4 py-2">
        {objectives.map((objective, index) => (
          <ObjectiveItem 
            key={index} 
            objective={objective}
            subObjectives={objective.subObjectives || []}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;