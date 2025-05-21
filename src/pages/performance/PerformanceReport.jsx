import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui/Tables';
import ObjectiveHeader from '../../components/balancescorecard/Header';
import OverallProgress from '../../components/balancescorecard/OverallProgress';
import FilterBox from '../../components/ui/FilterBox';
import Button from '../../components/ui/Button';
import { Tab } from '@headlessui/react';
import { 
  DocumentArrowDownIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';

// Custom Tab Button component for consistent styling
const TabButton = ({ children, isActive }) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-teal-100 text-teal-800 border-b-2 border-teal-500'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  );
};

// Card component for dashboard metrics
const MetricCard = ({ title, value, icon: Icon, color, percentage, trend }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {percentage && (
            <div className="flex items-center mt-1 text-xs">
              <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {trend === 'up' ? '↑' : '↓'} {percentage}
              </span>
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modify the generateSampleData function to include more comprehensive mock data
const generateSampleData = () => {
  const departments = ['Information Technology', 'Finance', 'Human Resources', 'Marketing', 'Operations'];
  const branches = ['Head Office', 'Kampala Branch', 'Eastern Region', 'Northern Region', 'Western Region'];
  const periods = ['Annual Review 2023', 'Annual Review 2024', 'Q1 2024', 'Q2 2024', 'Probation 6 months'];
  const statuses = ['Draft', 'Submitted', 'Approved', 'Rejected', 'In Progress', 'Completed'];
  const employees = [
    'John Smith', 'Sarah Johnson', 'David Wilson', 'Michael Brown', 'Emily Davis', 
    'Robert Chen', 'Lisa Wong', 'James Rodriguez', 'Maria Garcia', 'Derrick Katamba'
  ];
  const titles = [
    'Software Engineer', 'Marketing Specialist', 'Financial Analyst', 'HR Officer',
    'Operations Manager', 'Customer Service Rep', 'Sales Executive', 'Project Manager',
    'Director of Finance', 'Administrative Assistant'
  ];
  
  // Generate agreement data
  const agreementData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    employeeName: employees[Math.floor(Math.random() * employees.length)],
    employeeTitle: titles[Math.floor(Math.random() * titles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    branch: branches[Math.floor(Math.random() * branches.length)],
    title: `Performance Agreement ${Math.floor(Math.random() * 2) + 2023}`,
    period: periods[Math.floor(Math.random() * periods.length)],
    createdDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    submittedDate: Math.random() > 0.2 ? new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString() : null,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    kpiCount: Math.floor(Math.random() * 10) + 3,
    supervisorName: employees[Math.floor(Math.random() * employees.length)]
  }));
  
  // Generate appraisal data with Part A and Part B scores
  const appraisalData = Array.from({ length: 50 }, (_, i) => {
    // Generate random scores for Part A and Part B
    const totalPartA = (Math.random() * 20 + 70).toFixed(1); // Random score between 70-90
    const totalPartB = (Math.random() * 20 + 70).toFixed(1); // Random score between 70-90
    
    // Calculate weighted final score (assuming Part A is 80% and Part B is 20%)
    const finalScore = ((parseFloat(totalPartA) * 0.8) + (parseFloat(totalPartB) * 0.2)).toFixed(1);
    
    // Determine rating based on final score
    let rating;
    if (finalScore >= 91) rating = "Excellent";
    else if (finalScore >= 76) rating = "Very Good";
    else if (finalScore >= 60) rating = "Good";
    else if (finalScore >= 50) rating = "Fair";
    else rating = "Below Average";

    return {
      id: i + 1,
      employeeName: employees[Math.floor(Math.random() * employees.length)],
      employeeTitle: titles[Math.floor(Math.random() * titles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      agreementTitle: `Performance Agreement ${Math.floor(Math.random() * 2) + 2023}`,
      period: periods[Math.floor(Math.random() * periods.length)],
      submittedDate: Math.random() > 0.2 ? new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString() : null,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      supervisorName: employees[Math.floor(Math.random() * employees.length)],
      selfRating: (Math.random() * 2 + 3).toFixed(1),
      supervisorRating: (Math.random() * 2 + 3).toFixed(1),
      totalPartA: totalPartA,
      totalPartB: totalPartB,
      finalScore: finalScore,
      rating: rating
    };
  });
  
  // Define probation periods
  const probationPeriods = ['3 months', '6 months', '12 months'];
  
  // Generate confirmation data with specific probation periods
  const confirmationData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    employeeName: employees[Math.floor(Math.random() * employees.length)],
    employeeTitle: titles[Math.floor(Math.random() * titles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    branch: branches[Math.floor(Math.random() * branches.length)],
    probationStartDate: new Date(2023, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toISOString(),
    probationEndDate: new Date(2023, Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 28) + 1).toISOString(),
    period: probationPeriods[Math.floor(Math.random() * probationPeriods.length)],
    supervisorRecommendation: ["Confirm", "Extend Probation", "Terminate"][Math.floor(Math.random() * 3)],
    hodDecision: ["Approved", "Rejected", "Pending"][Math.floor(Math.random() * 3)],
    status: ["Draft", "In Review", "Approved", "Rejected"][Math.floor(Math.random() * 4)],
    supervisorName: employees[Math.floor(Math.random() * employees.length)],
    confirmationDate: Math.random() > 0.3 ? new Date(2023, Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 28) + 1).toISOString() : null,
    performanceScore: (Math.random() * 20 + 75).toFixed(1)
  }));
  
  // Calculate status distribution for agreements
  const agreementStatusDistribution = {
    draft: agreementData.filter(a => a.status === 'Draft').length,
    submitted: agreementData.filter(a => a.status === 'Submitted').length,
    pending_supervisor: agreementData.filter(a => a.status === 'Pending Supervisor').length,
    pending_hod: agreementData.filter(a => a.status === 'Pending HOD').length,
    approved: agreementData.filter(a => a.status === 'Approved').length,
    rejected: agreementData.filter(a => a.status === 'Rejected').length,
  };
  
  // Calculate department distribution for agreements
  const agreementDepartmentDistribution = {};
  departments.forEach(dept => {
    agreementDepartmentDistribution[dept] = agreementData.filter(a => a.department === dept).length;
  });
  
  // Calculate appraisal status distribution
  const appraisalStatusDistribution = {
    pending_rating: appraisalData.filter(a => a.status === 'Draft' || a.status === 'Pending Rating').length,
    in_progress: appraisalData.filter(a => a.status === 'In Progress').length,
    submitted: appraisalData.filter(a => a.status === 'Submitted').length,
    pending_supervisor: appraisalData.filter(a => a.status === 'Pending Supervisor').length,
    supervisor_reviewed: appraisalData.filter(a => a.status === 'Supervisor Reviewed').length,
    pending_hod: appraisalData.filter(a => a.status === 'Pending HOD').length,
    completed: appraisalData.filter(a => a.status === 'Completed').length,
  };
  
  // Calculate rating distribution
  const ratingDistribution = {
    excellent: appraisalData.filter(a => a.rating === 'Excellent').length,
    veryGood: appraisalData.filter(a => a.rating === 'Very Good').length,
    good: appraisalData.filter(a => a.rating === 'Good').length,
    fair: appraisalData.filter(a => a.rating === 'Fair').length,
    belowAverage: appraisalData.filter(a => a.rating === 'Below Average').length,
  };
  
  // Calculate confirmation status distribution
  const confirmationStatusDistribution = {
    draft: confirmationData.filter(c => c.status === 'Draft').length,
    inReview: confirmationData.filter(c => c.status === 'In Review').length,
    approved: confirmationData.filter(c => c.status === 'Approved').length,
    rejected: confirmationData.filter(c => c.status === 'Rejected').length,
  };
  
  return { 
    agreementData, 
    appraisalData, 
    confirmationData,
    agreementStatusDistribution,
    agreementDepartmentDistribution,
    appraisalStatusDistribution,
    ratingDistribution,
    confirmationStatusDistribution
  };
};

const PerformanceReport = () => {
  // Filter states
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  
  // Main tab state
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  
  const { 
    agreementData, 
    appraisalData, 
    confirmationData,
    agreementStatusDistribution,
    agreementDepartmentDistribution,
    appraisalStatusDistribution,
    ratingDistribution,
    confirmationStatusDistribution 
  } = generateSampleData();
  
  // State for filtered data
  const [filteredAgreements, setFilteredAgreements] = useState(agreementData);
  const [filteredAppraisals, setFilteredAppraisals] = useState(appraisalData);
  const [filteredConfirmations, setFilteredConfirmations] = useState(confirmationData);
  
  // Apply filters when filter state changes
  useEffect(() => {
    // Filter agreements
    let agreements = agreementData;
    if (filterDepartment) {
      agreements = agreements.filter(item => item.department === filterDepartment);
    }
    if (filterBranch) {
      agreements = agreements.filter(item => item.branch === filterBranch);
    }
    if (filterPeriod) {
      agreements = agreements.filter(item => item.period === filterPeriod);
    }
    if (filterStatus) {
      agreements = agreements.filter(item => item.status === filterStatus);
    }
    if (filterEmployee) {
      agreements = agreements.filter(item => 
        item.employeeName.toLowerCase().includes(filterEmployee.toLowerCase())
      );
    }
    setFilteredAgreements(agreements);
    
    // Filter appraisals
    let appraisals = appraisalData;
    if (filterDepartment) {
      appraisals = appraisals.filter(item => item.department === filterDepartment);
    }
    if (filterBranch) {
      appraisals = appraisals.filter(item => item.branch === filterBranch);
    }
    if (filterPeriod) {
      appraisals = appraisals.filter(item => item.period === filterPeriod);
    }
    if (filterStatus) {
      appraisals = appraisals.filter(item => item.status === filterStatus);
    }
    if (filterEmployee) {
      appraisals = appraisals.filter(item => 
        item.employeeName.toLowerCase().includes(filterEmployee.toLowerCase())
      );
    }
    setFilteredAppraisals(appraisals);
    
    // Filter confirmations
    let confirmations = confirmationData;
    if (filterDepartment) {
      confirmations = confirmations.filter(item => item.department === filterDepartment);
    }
    if (filterBranch) {
      confirmations = confirmations.filter(item => item.branch === filterBranch);
    }
    if (filterStatus) {
      confirmations = confirmations.filter(item => item.status === filterStatus);
    }
    if (filterEmployee) {
      confirmations = confirmations.filter(item => 
        item.employeeName.toLowerCase().includes(filterEmployee.toLowerCase())
      );
    }
    setFilteredConfirmations(confirmations);
    
  }, [filterDepartment, filterBranch, filterPeriod, filterStatus, filterEmployee]);
  
  // Get unique values for filter dropdowns
  const departments = [...new Set(agreementData.map(item => item.department))];
  const branches = [...new Set(agreementData.map(item => item.branch))];
  const periods = [...new Set(agreementData.map(item => item.period))];
  const statuses = [...new Set([...agreementData.map(item => item.status), ...appraisalData.map(item => item.status), ...confirmationData.map(item => item.status)])];
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Export functionality
  const handleExportCSV = () => {
    // Implement export functionality based on the selected tab
    let data;
    let filename;
    
    switch(selectedTabIndex) {
      case 0: // Agreements
        data = filteredAgreements;
        filename = "performance_agreements_report.csv";
        break;
      case 1: // Appraisals
        data = filteredAppraisals;
        filename = "performance_appraisals_report.csv";
        break;
      case 2: // Confirmations
        data = filteredConfirmations;
        filename = "performance_confirmations_report.csv";
        break;
      default:
        data = filteredAgreements;
        filename = "performance_report.csv";
    }
    
    // Convert data to CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csv = headers + '\n' + rows;
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert(`Exporting ${data.length} records to ${filename}`);
  };
  
  // Reset filters
  const handleReset = () => {
    setFilterDepartment('');
    setFilterBranch('');
    setFilterPeriod('');
    setFilterStatus('');
    setFilterEmployee('');
  };
  
  // Calculate aggregated metrics for cards
  const metrics = {
    totalAgreements: agreementData.length,
    submittedAgreements: agreementData.filter(a => a.submittedDate).length,
    agreementCompletionRate: Math.round((agreementData.filter(a => a.status === 'Approved').length / agreementData.length) * 100),
    
    totalAppraisals: appraisalData.length,
    completedAppraisals: appraisalData.filter(a => a.status === 'Completed').length,
    averageScore: (appraisalData.reduce((sum, a) => sum + parseFloat(a.finalScore || 0), 0) / appraisalData.length).toFixed(1),
    
    excellentRatings: appraisalData.filter(a => a.rating === 'Excellent').length,
    goodRatings: appraisalData.filter(a => a.rating === 'Good' || a.rating === 'Very Good').length,
    
    pendingConfirmations: confirmationData.filter(c => c.status === 'In Review').length,
    confirmedEmployees: confirmationData.filter(c => c.status === 'Approved').length,
  };

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Performance Reports</h1>
          <p className="text-sm text-gray-600 mt-1">
            Generate and export comprehensive performance management reports
          </p>
        </div>
        <OverallProgress progress={85} riskStatus={false} />
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="Performance Report Filters"
          filters={[
            {
              id: 'filterEmployee',
              label: 'Employee',
              type: 'text',
              placeholder: 'Search by employee name...',
              value: filterEmployee,
              onChange: (e) => setFilterEmployee(e.target.value),
            },
            {
              id: 'filterDepartment',
              label: 'Department',
              type: 'select',
              value: filterDepartment,
              onChange: (e) => setFilterDepartment(e.target.value),
              options: [
                { value: '', label: '-- All Departments --' },
                ...departments.map(dept => ({ value: dept, label: dept }))
              ],
            },
            {
              id: 'filterBranch',
              label: 'Branch/Unit',
              type: 'select',
              value: filterBranch,
              onChange: (e) => setFilterBranch(e.target.value),
              options: [
                { value: '', label: '-- All Branches --' },
                ...branches.map(branch => ({ value: branch, label: branch }))
              ],
            },
            {
              id: 'filterPeriod',
              label: 'Period',
              type: 'select',
              value: filterPeriod,
              onChange: (e) => setFilterPeriod(e.target.value),
              options: [
                { value: '', label: '-- All Periods --' },
                ...periods.map(period => ({ value: period, label: period }))
              ],
            },
            {
              id: 'filterStatus',
              label: 'Status',
              type: 'select',
              value: filterStatus,
              onChange: (e) => setFilterStatus(e.target.value),
              options: [
                { value: '', label: '-- All Statuses --' },
                ...statuses.map(status => ({ value: status, label: status }))
              ],
            },
          ]}
          buttons={[
            {
              label: 'Reset Filters',
              variant: 'secondary',
              onClick: handleReset,
            },
            {
              label: 'Export Data',
              variant: 'primary',
              onClick: handleExportCSV,
              icon: ArrowDownTrayIcon
            },
          ]}
        />
        
        {/* Dashboard Metrics */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Agreements"
            value={metrics.totalAgreements}
            icon={ClipboardDocumentListIcon}
            color="bg-blue-500"
            percentage="8%"
            trend="up"
          />
          <MetricCard
            title="Total Appraisals"
            value={metrics.totalAppraisals}
            icon={ClipboardDocumentCheckIcon}
            color="bg-teal-500"
            percentage="12%"
            trend="up"
          />
          <MetricCard
            title="Average Performance Score"
            value={metrics.averageScore}
            icon={ChartBarIcon}
            color="bg-purple-500"
            percentage="5%"
            trend="up"
          />
          <MetricCard
            title="Agreement Completion Rate"
            value={`${metrics.agreementCompletionRate}%`}
            icon={ArrowTrendingUpIcon}
            color="bg-green-500"
            percentage="3%"
            trend="up"
          />
        </div>
        
        {/* Add Status Distribution Charts */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Agreement Status Distribution */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-gray-700 font-medium mb-3">Agreement Status Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Draft</span>
                <span className="text-sm font-medium">{agreementStatusDistribution.draft}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${(agreementStatusDistribution.draft / filteredAgreements.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Submitted</span>
                <span className="text-sm font-medium">{agreementStatusDistribution.submitted}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(agreementStatusDistribution.submitted / filteredAgreements.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Supervisor</span>
                <span className="text-sm font-medium">{agreementStatusDistribution.pending_supervisor}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(agreementStatusDistribution.pending_supervisor / filteredAgreements.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending HOD</span>
                <span className="text-sm font-medium">{agreementStatusDistribution.pending_hod}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(agreementStatusDistribution.pending_hod / filteredAgreements.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Approved</span>
                <span className="text-sm font-medium">{agreementStatusDistribution.approved}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(agreementStatusDistribution.approved / filteredAgreements.length) * 100}%` }}></div>
              </div>
            </div>
          </div>
          
          {/* Appraisal Status Distribution */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-gray-700 font-medium mb-3">Appraisal Status Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Rating</span>
                <span className="text-sm font-medium">{appraisalStatusDistribution.pending_rating}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${(appraisalStatusDistribution.pending_rating / filteredAppraisals.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">In Progress</span>
                <span className="text-sm font-medium">{appraisalStatusDistribution.in_progress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(appraisalStatusDistribution.in_progress / filteredAppraisals.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Supervisor</span>
                <span className="text-sm font-medium">{appraisalStatusDistribution.pending_supervisor}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(appraisalStatusDistribution.pending_supervisor / filteredAppraisals.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending HOD</span>
                <span className="text-sm font-medium">{appraisalStatusDistribution.pending_hod}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(appraisalStatusDistribution.pending_hod / filteredAppraisals.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-medium">{appraisalStatusDistribution.completed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(appraisalStatusDistribution.completed / filteredAppraisals.length) * 100}%` }}></div>
              </div>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-gray-700 font-medium mb-3">Performance Rating Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Excellent</span>
                <span className="text-sm font-medium">{ratingDistribution.excellent}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(ratingDistribution.excellent / filteredAppraisals.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Very Good</span>
                <span className="text-sm font-medium">{ratingDistribution.veryGood}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(ratingDistribution.veryGood / filteredAppraisals.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Good</span>
                <span className="text-sm font-medium">{ratingDistribution.good}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(ratingDistribution.good / filteredAppraisals.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Fair</span>
                <span className="text-sm font-medium">{ratingDistribution.fair}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(ratingDistribution.fair / filteredAppraisals.length) * 100}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Below Average</span>
                <span className="text-sm font-medium">{ratingDistribution.belowAverage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(ratingDistribution.belowAverage / filteredAppraisals.length) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for different report types */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
            <Tab.List className="flex space-x-2 border-b border-gray-200 mb-4">
              <Tab>
                {({ selected }) => (
                  <TabButton isActive={selected}>
                    <span className="flex items-center">
                      <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
                      Agreements Report
                    </span>
                  </TabButton>
                )}
              </Tab>
              <Tab>
                {({ selected }) => (
                  <TabButton isActive={selected}>
                    <span className="flex items-center">
                      <ClipboardDocumentCheckIcon className="w-4 h-4 mr-2" />
                      Appraisals Report
                    </span>
                  </TabButton>
                )}
              </Tab>
              <Tab>
                {({ selected }) => (
                  <TabButton isActive={selected}>
                    <span className="flex items-center">
                      <CheckBadgeIcon className="w-4 h-4 mr-2" />
                      Confirmations Report
                    </span>
                  </TabButton>
                )}
              </Tab>
            </Tab.List>
            
            <Tab.Panels>
              {/* Agreements Report Tab - Updated */}
              <Tab.Panel>
                {/* Add summary metrics for Agreements */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Agreements</h3>
                    <p className="text-xl font-bold">{filteredAgreements.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Submitted for Review</h3>
                    <p className="text-xl font-bold text-blue-600">{agreementStatusDistribution.submitted}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Supervisor Approved</h3>
                    <p className="text-xl font-bold text-purple-600">{agreementStatusDistribution.pending_hod}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Fully Approved</h3>
                    <p className="text-xl font-bold text-green-600">{agreementStatusDistribution.approved}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg overflow-x-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Employee</TableHeader>
                        <TableHeader>Department</TableHeader>
                        <TableHeader>Branch/Unit</TableHeader>
                        <TableHeader>Agreement Title</TableHeader>
                        <TableHeader>Period</TableHeader>
                        <TableHeader>Supervisor</TableHeader>
                        <TableHeader>Status</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAgreements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No agreement data found for the selected filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAgreements.slice(0, 10).map((agreement) => (
                          <TableRow key={agreement.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="text-sm font-medium text-gray-900">{agreement.employeeName}</div>
                              <div className="text-xs text-gray-500">{agreement.employeeTitle}</div>
                            </TableCell>
                            <TableCell>{agreement.department}</TableCell>
                            <TableCell>{agreement.branch}</TableCell>
                            <TableCell>{agreement.title}</TableCell>
                            <TableCell>{agreement.period}</TableCell>
                            <TableCell>{agreement.supervisorName}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                agreement.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                agreement.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                agreement.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                agreement.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {agreement.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  
                  {filteredAgreements.length > 10 && (
                    <div className="py-3 px-4 text-right">
                      <span className="text-sm text-gray-600">
                        Showing 10 of {filteredAgreements.length} results. Export for full data.
                      </span>
                    </div>
                  )}
                </div>
              </Tab.Panel>
              
              {/* Appraisals Report Tab - Updated */}
              <Tab.Panel>
                {/* Add summary metrics for Appraisals */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Appraisals</h3>
                    <p className="text-xl font-bold">{filteredAppraisals.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Supervisor</h3>
                    <p className="text-xl font-bold text-amber-600">{appraisalStatusDistribution.pending_supervisor}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Pending HOD</h3>
                    <p className="text-xl font-bold text-purple-600">{appraisalStatusDistribution.pending_hod}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Completed</h3>
                    <p className="text-xl font-bold text-green-600">{appraisalStatusDistribution.completed}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg overflow-x-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Employee</TableHeader>
                        <TableHeader>Department</TableHeader>
                        <TableHeader>Branch/Unit</TableHeader>
                        <TableHeader>Agreement</TableHeader>
                        <TableHeader>Period</TableHeader>
                        <TableHeader>Part A Score</TableHeader>
                        <TableHeader>Part B Score</TableHeader>
                        <TableHeader>Total Score</TableHeader>
                        <TableHeader>Rating</TableHeader>
                        <TableHeader>Status</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAppraisals.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            No appraisal data found for the selected filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAppraisals.slice(0, 10).map((appraisal) => (
                          <TableRow key={appraisal.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="text-sm font-medium text-gray-900">{appraisal.employeeName}</div>
                              <div className="text-xs text-gray-500">{appraisal.employeeTitle}</div>
                            </TableCell>
                            <TableCell>{appraisal.department}</TableCell>
                            <TableCell>{appraisal.branch}</TableCell>
                            <TableCell>{appraisal.agreementTitle}</TableCell>
                            <TableCell>{appraisal.period}</TableCell>
                            <TableCell>{appraisal.totalPartA || '-'}</TableCell>
                            <TableCell>{appraisal.totalPartB || '-'}</TableCell>
                            <TableCell className="font-medium">{appraisal.finalScore || '-'}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                appraisal.rating === 'Excellent' ? 'bg-green-100 text-green-700' :
                                appraisal.rating === 'Very Good' ? 'bg-blue-100 text-blue-700' :
                                appraisal.rating === 'Good' ? 'bg-teal-100 text-teal-700' :
                                appraisal.rating === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {appraisal.rating || 'Not Rated'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                appraisal.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                appraisal.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                appraisal.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                appraisal.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {appraisal.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  
                  {filteredAppraisals.length > 10 && (
                    <div className="py-3 px-4 text-right">
                      <span className="text-sm text-gray-600">
                        Showing 10 of {filteredAppraisals.length} results. Export for full data.
                      </span>
                    </div>
                  )}
                </div>
              </Tab.Panel>
              
              {/* Confirmations Report Tab - Updated */}
              <Tab.Panel>
                {/* Add summary metrics for Confirmations */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Confirmations</h3>
                    <p className="text-xl font-bold">{filteredConfirmations.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">In Review</h3>
                    <p className="text-xl font-bold text-amber-600">{confirmationStatusDistribution.inReview}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Approved</h3>
                    <p className="text-xl font-bold text-green-600">{confirmationStatusDistribution.approved}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Rejected</h3>
                    <p className="text-xl font-bold text-red-600">{confirmationStatusDistribution.rejected}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg overflow-x-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Employee</TableHeader>
                        <TableHeader>Department</TableHeader>
                        <TableHeader>Branch/Unit</TableHeader>
                        <TableHeader>Period</TableHeader>
                        <TableHeader>Supervisor</TableHeader>
                        <TableHeader>Performance Score</TableHeader>
                        <TableHeader>Supervisor Recommendation</TableHeader>
                        <TableHeader>HOD Decision</TableHeader>
                        <TableHeader>Confirmation Date</TableHeader>
                        <TableHeader>Status</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredConfirmations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            No confirmation data found for the selected filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredConfirmations.slice(0, 10).map((confirmation) => (
                          <TableRow key={confirmation.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="text-sm font-medium text-gray-900">{confirmation.employeeName}</div>
                              <div className="text-xs text-gray-500">{confirmation.employeeTitle}</div>
                            </TableCell>
                            <TableCell>{confirmation.department}</TableCell>
                            <TableCell>{confirmation.branch}</TableCell>
                            <TableCell>{confirmation.period}</TableCell>
                            <TableCell>{confirmation.supervisorName}</TableCell>
                            <TableCell>{confirmation.performanceScore}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                confirmation.supervisorRecommendation === 'Confirm' ? 'bg-green-100 text-green-700' :
                                confirmation.supervisorRecommendation === 'Extend Probation' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {confirmation.supervisorRecommendation}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                confirmation.hodDecision === 'Approved' ? 'bg-green-100 text-green-700' :
                                confirmation.hodDecision === 'Rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {confirmation.hodDecision}
                              </span>
                            </TableCell>
                            <TableCell>{formatDate(confirmation.confirmationDate)}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                confirmation.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                confirmation.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                confirmation.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {confirmation.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  
                  {filteredConfirmations.length > 10 && (
                    <div className="py-3 px-4 text-right">
                      <span className="text-sm text-gray-600">
                        Showing 10 of {filteredConfirmations.length} results. Export for full data.
                      </span>
                    </div>
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        
        {/* Add Trend Analysis Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-gray-700 font-medium mb-4">Performance Trend Analysis</h3>
          
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col justify-center items-center border border-dashed border-gray-300">
            <div className="w-full space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Average Performance Score Over Time</h4>
                <div className="h-40 flex items-end space-x-2">
                  {['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'].map((quarter, index) => {
                    const height = 60 + Math.random() * 30; // Random height between 60-90%
                    return (
                      <div key={quarter} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full rounded-t-sm ${
                            height > 85 ? 'bg-green-500' : 
                            height > 75 ? 'bg-blue-500' : 
                            height > 65 ? 'bg-teal-500' : 
                            'bg-amber-500'
                          }`}
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs mt-2 text-gray-600">{quarter}</div>
                        <div className="text-xs font-medium">{height.toFixed(1)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Department Score Comparison</h4>
                  <div className="space-y-3">
                    {departments.slice(0, 5).map(dept => (
                      <div key={dept} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{dept}</span>
                          <span>{(75 + Math.random() * 15).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${75 + Math.random() * 15}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Agreement Completion Rate by Month</h4>
                  <div className="space-y-3">
                    {['January', 'February', 'March', 'April', 'May', 'June'].map(month => (
                      <div key={month} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{month}</span>
                          <span>{(60 + Math.random() * 30).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-500 h-2 rounded-full" 
                            style={{ width: `${60 + Math.random() * 30}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add export options */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-gray-700 font-medium mb-3">Export Options</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => alert('Exporting PDF...')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Export as PDF
            </button>
            <button
              onClick={() => alert('Exporting Excel...')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Export as Excel
            </button>
            <button
              onClick={() => alert('Exporting CSV...')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Export as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReport;
