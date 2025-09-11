import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowTrendingUpIcon, 
  CalendarIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  DocumentCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  PaperClipIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { LineChart, BarChart, PieChart, RadarChart } from '../components/charts';
import { useAuth } from '../hooks/useAuth';

// Mock data for various sections
const mockDeadlines = [
  { id: 1, title: "Performance Agreement Submission", date: "2024-08-15", urgent: true, type: "performance" },
  { id: 2, title: "Submit Anuual Review Appraisal", date: "2024-07-31", urgent: true, type: "appraisal" },
];

const mockUndertakings = [
  { id: 1, title: "Annual Code of Conduct", status: "signed", signedDate: "2024-03-15", dueDate: "2024-03-31" },
  { id: 2, title: "Confidentiality Agreement", status: "signed", signedDate: "2024-01-10", dueDate: "2024-01-15" },
  { id: 3, title: "Anti-Corruption Policy", status: "not_signed", dueDate: "2024-07-31" },
  { id: 4, title: "Information Security Policy", status: "not_signed", dueDate: "2024-08-15" },
  { id: 5, title: "Annual Declaration of Interests", status: "expired", signedDate: "2023-06-10", dueDate: "2023-06-15" }
];

// Data for charts
const performanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Your Performance',
      data: [76, 85, 82, 88, 85, 90],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Department Average',
      data: [72, 75, 74, 76, 80, 82],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
    }
  ]
};

const undertakingComplianceData = {
  labels: ['Signed', 'Not Signed', 'Expired'],
  datasets: [{
    data: [65, 25, 10],
    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
  }]
};

const skillsCompetencyData = {
  labels: [
    'Technical Expertise', 
    'Communication', 
    'Teamwork', 
    'Leadership', 
    'Problem Solving',
    'Innovation'
  ],
  datasets: [{
    label: 'Your Skills',
    data: [85, 70, 90, 65, 80, 75],
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
    borderWidth: 2,
    pointBackgroundColor: '#10b981',
  },
  {
    label: 'Department Average',
    data: [75, 65, 70, 60, 75, 60],
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: '#6366f1',
    borderWidth: 2,
    pointBackgroundColor: '#6366f1',
  }]
};

const recentActivitiesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Training Hours',
    data: [8, 12, 5, 15, 10, 6],
    backgroundColor: '#06b6d4',
  }]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const simulateRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };
  
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen mt-8 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize-first-letter">
          Welcome Back, {user?.surname && user?.first_name ? `${user?.surname} ${user?.first_name}` : 'User'}
            </h1>
            <p className="text-gray-600 mt-1">
          Here's an overview of your HR dashboard and upcoming activities.
            </p>
          </div>
          <button 
            onClick={simulateRefresh} 
            className={`p-2 rounded-full hover:bg-gray-200 ${refreshing ? 'animate-spin text-blue-600' : ''}`}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Actions Section - Moved up */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-teal-800 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2" />
            Quick Actions
          </h2>
        </div>
        <div className="p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
            <Link to="/performance/agreement/list" className="group p-4 rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-teal-100 text-teal-600 group-hover:bg-teal-200">
                  <DocumentTextIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-teal-700">Performance Agreement</h3>
                  <p className="text-sm text-gray-500 mt-1">Setup your balance scorecard performance agreements</p>
                </div>
              </div>
            </Link>
            
            <Link to="/performance/rating/self" className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                  <ArrowTrendingUpIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-700">Self-Rating</h3>
                  <p className="text-sm text-gray-500 mt-1">Start your appraisal rating against your performance measure/indicator</p>
                </div>
              </div>
            </Link>
            
            <Link to="/hr/annual-undertaking/view" className="group p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-200">
                  <PaperClipIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-purple-700">Annual Undertakings</h3>
                  <p className="text-sm text-gray-500 mt-1">View and sign required HR documents</p>
                </div>
              </div>
            </Link>
            
            <Link to="/profile" className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-gray-700">My Profile</h3>
                  <p className="text-sm text-gray-500 mt-1">Update your personal information and upload your signature</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Deadlines - Made more prominent */}
      <section className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl shadow-md border border-teal-200 overflow-hidden">
        <div className="bg-teal-500 px-6 py-4 text-white">
          <h2 className="text-lg font-semibold flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Upcoming Deadlines
          </h2>
        </div>
        <div className="p-4">
          {mockDeadlines.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No upcoming deadlines.</p>
          ) : (
            <ul className="space-y-3">
              {mockDeadlines.map(deadline => (
                <li key={deadline.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-teal-100 hover:border-amber-300 transition-all">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                    deadline.urgent 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {deadline.urgent ? (
                      <ExclamationCircleIcon className="h-6 w-6" />
                    ) : (
                      <CalendarIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(deadline.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  {deadline.urgent && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Urgent
                    </span>
                  )}
                  <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-4" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Two Column Layout for Analytics and Annual Undertakings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-blue-800 flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              Your Performance Trends
            </h2>
          </div>
          <div className="p-4 h-80">
            <LineChart data={performanceData} />
          </div>
        </section>

        {/* Annual Execution Undertakings */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-purple-800 flex items-center">
              <DocumentCheckIcon className="h-5 w-5 mr-2" />
              Annual Execution Undertakings
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              {mockUndertakings.map(undertaking => (
                <div key={undertaking.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    undertaking.status === 'signed' ? 'bg-green-100 text-green-600' :
                    undertaking.status === 'not_signed' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {undertaking.status === 'signed' ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : undertaking.status === 'not_signed' ? (
                      <PaperClipIcon className="h-6 w-6" />
                    ) : (
                      <XCircleIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{undertaking.title}</p>
                    <p className="text-xs text-gray-500">
                      {undertaking.status === 'signed' 
                        ? `Signed on: ${new Date(undertaking.signedDate).toLocaleDateString()}` 
                        : undertaking.status === 'not_signed'
                        ? `Due by: ${new Date(undertaking.dueDate).toLocaleDateString()}`
                        : `Expired: ${new Date(undertaking.dueDate).toLocaleDateString()}`
                      }
                    </p>
                  </div>
                  {undertaking.status === 'not_signed' ? (
                    <Link 
                      to="/hr/annual-undertaking/view" 
                      className="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                      Sign Now
                    </Link>
                  ) : undertaking.status === 'expired' ? (
                    <span className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md">
                      Expired
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md">
                      Completed
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link 
                to="/hr/annual-undertaking/view" 
                className="inline-flex items-center text-purple-600 hover:text-purple-800"
              >
                View all undertakings
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Additional Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Undertaking Compliance */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Undertaking Compliance</h2>
          </div>
          <div className="p-4 flex justify-center h-64">
            <div style={{ width: '80%', height: '100%' }}>
              <PieChart data={undertakingComplianceData} />
            </div>
          </div>
        </section>

        {/* Skills & Competencies */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Skills & Competencies</h2>
          </div>
          <div className="p-4 h-64">
            <RadarChart data={skillsCompetencyData} />
          </div>
        </section>
      </div>

      {/* HR Policy Assistant CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-amber-300 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
            <div className="bg-white/20 rounded-full p-4">
              <ChatBubbleBottomCenterTextIcon className="h-16 w-16 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">Introducing HR Policy Assistant</h2>
            <p className="text-white/90 mb-4 max-w-2xl">
              Get instant answers to your HR policy questions. Chat with our AI assistant to quickly find the information you need about the different HR documents.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/hr/policy/chat" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-teal-700 bg-white hover:bg-indigo-50"
              >
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2" />
                Chat with Policy Assistant
              </Link>
              <Link 
                to="/hr/policy/explorer" 
                className="inline-flex items-center px-4 py-2 border border-white text-base font-medium rounded-md text-white hover:bg-white/20"
              >
                <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
                Explore HR Policies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
