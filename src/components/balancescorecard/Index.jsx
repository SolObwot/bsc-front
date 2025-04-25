import React, { useState } from 'react';
import ObjectiveHeader from './Header';
import ObjectiveTabs from './Tabs';
import OverallProgress from './OverallProgress';
import InfoBanner from './InfoBanner';
import ObjectiveItem from './Item';
import ObjectiveListHeader from './ListHeader';

// Integrated sample data with sub-objectives included in each objective
const objectives = [

  // Qualitative Objectives
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
          { id: 101, name: "Improve TAT for resolution of system issues for Customer facing systems (25 mins)", weight: "10%" },
          { id: 102, name: "Recovery time of key systems (BSC HRMS) in 120 minutes.", weight: "5%" },
          { id: 103, name: "2 by 1 Mobilizations Accounts", weight: "5%" },
          { id: 104, name: "Uptime for all key support systems  98% (BSC HRMS, DPC)", weight: "5%" },
          { id: 105, name: "Development and Implementation of BSC_HRMS platform", weight: "5%" }
        ]
      },
      {
        id: 2,
        name: "Improve profit margins",
        weight: "10%",
        indicators: [
          { id: 201, name: "Gross profit margin", weight: "5%" },
          { id: 202, name: "Operating expense ratio", weight: "5%" },
          { id: 203, name: "Return on Investment (ROI)", weight: "4%" }, // Added Indicator 1
          { id: 204, name: "Net Profit Margin", weight: "3%" } // Added Indicator 11
        ]
      },
      {
        id: 3,
        name: "Enhance cost efficiency",
        weight: "10%",
        indicators: [
          { id: 301, name: "Cost per unit reduction", weight: "5%" },
          { id: 302, name: "Budget variance percentage", weight: "5%" },
          { id: 303, name: "Cost Savings from Initiatives", weight: "4%" } // Added Indicator 2
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
          { id: 102, name: "Customer Retention Rate", weight: "7%" },
          { id: 103, name: "Customer Effort Score (CES)", weight: "6%" }, // Added Indicator 3
          { id: 104, name: "Customer Lifetime Value (CLTV)", weight: "5%" } // Added Indicator 12
        ]
      },
      {
        id: 2,
        name: "Expand market share",
        weight: "10%",
        indicators: [
          { id: 201, name: "Market penetration percentage", weight: "5%" },
          { id: 202, name: "Competitive position index", weight: "5%" },
          { id: 203, name: "Customer Acquisition Cost (CAC)", weight: "4%" } // Added Indicator 4
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
          { id: 102, name: "Error rate percentage", weight: "7%" },
          { id: 103, name: "First Call Resolution Rate", weight: "6%" }, // Added Indicator 5
          { id: 104, name: "Automation Rate", weight: "5%" } // Added Indicator 13
        ]
      },
      {
        id: 2,
        name: "Improve supply chain efficiency",
        weight: "10%",
        indicators: [
          { id: 201, name: "Delivery time performance", weight: "5%" },
          { id: 202, name: "Inventory turnover rate", weight: "5%" },
          { id: 203, name: "Supplier Performance Rating", weight: "4%" } // Added Indicator 6
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
          { id: 102, name: "Skills assessment scores", weight: "8%" },
          { id: 103, name: "Internal Promotion Rate", weight: "6%" } // Added Indicator 7
        ]
      },
      {
        id: 2,
        name: "Foster innovation culture",
        weight: "10%",
        indicators: [
          { id: 201, name: "New ideas submitted", weight: "5%" },
          { id: 202, name: "Innovation implementation rate", weight: "5%" },
          { id: 203, name: "Time to Market for New Features", weight: "4%" }, // Added Indicator 8
          { id: 204, name: "Patent Application Rate", weight: "3%" } // Added Indicator 14
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
  // Quantative Objectives
  {
    title: 'Integrity & Accountability',
    totalWeight: '2%',
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
        name: "Enhance employee skills", // Note: Sub-objective name might need review for this category
        weight: "15%", // Note: Weights within qualitative objectives might need review
        indicators: [
              { id: 101, name: "Training completion rate measures the percentage of employees who have successfully completed their training programs within a specified period.", weight: "7%" },
              { id: 102, name: "Skills assessment scores evaluate the scores obtained by employees in various skills assessments, reflecting their proficiency and improvement over time.", weight: "8%" },
              { id: 103, name: "Employee Retention Rate tracks the percentage of employees who remain with the company over a given period, indicating job satisfaction and organizational stability.", weight: "10%" },
              { id: 104, name: "Customer Satisfaction Scores measure the level of satisfaction reported by customers through surveys and feedback forms, highlighting the quality of service provided.", weight: "12%" },
              { id: 105, name: "Project Completion Rate tracks the percentage of projects completed on time and within budget, reflecting the efficiency and effectiveness of project management.", weight: "9%" },
              { id: 106, name: "Innovation Index measures the number of new ideas, products, or processes developed and implemented, showcasing the organization's commitment to innovation.", weight: "6%" },
              { id: 107, name: "Revenue Growth Rate tracks the rate at which the company's revenue is increasing over time, indicating financial health and market performance.", weight: "15%" },
              { id: 108, name: "Operational Efficiency measures the efficiency of the company's operations by comparing output to input, highlighting areas for improvement.", weight: "8%" },
              { id: 109, name: "Employee Engagement Level assesses the level of engagement and motivation among employees, which can impact productivity and job satisfaction.", weight: "11%" },
              { id: 110, name: "Quality of Work evaluates the quality of work produced by employees, ensuring that it meets the company's standards and customer expectations.", weight: "14%" },
              { id: 111, name: "Compliance Training Completion Rate", weight: "5%" }, // Added Indicator 9
              { id: 112, name: "Ethics Violation Reports", weight: "4%" } // Added Indicator 15
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
  {
    title: 'Customer Centricity',
    totalWeight: '2%',
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
        name: "Enhance employee skills", // Note: Sub-objective name might need review
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
  {
    title: 'Teamwork & Collaboration',
    totalWeight: '2%',
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
        name: "Enhance employee skills", // Note: Sub-objective name might need review
        weight: "15%",
        indicators: [
          { id: 101, name: "Training completion rate", weight: "7%" },
          { id: 102, name: "Skills assessment scores", weight: "8%" },
          { id: 103, name: "Cross-functional Team Performance Score", weight: "6%" } // Added Indicator 10
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
  {
    title: 'Efficiency & Effectiveness',
    totalWeight: '25%', // Note: This seems high for a qualitative objective, might be quantitative?
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
        name: "Enhance employee skills", // Note: Sub-objective name might need review
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
  {
    title: 'Fairness & Transparency',
    totalWeight: '2%',
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
        name: "Enhance employee skills", // Note: Sub-objective name might need review
        weight: "15%",
        indicators: [
          { id: 101, name: "Training completion rate", weight: "7%" }
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
      }
    ]
  },
];

// Separate objectives into quantitative and qualitative
const quantitativeObjectives = objectives.slice(0, 4); // FINANCIAL, CUSTOMER, INTERNAL PROCESSES, INNOVATION
const qualitativeObjectives = objectives.slice(4);    // Integrity, Customer Centricity, etc.

const Index = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Display objectives based on active tab
  const displayedObjectives = activeTab === 'active' ? quantitativeObjectives : qualitativeObjectives;

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
          />
        ))}
      </div>
    </div>
  );
};

export default Index;