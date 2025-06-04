import React from 'react';
import { Link } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';

const StrategyPerspectiveList = () => {
  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Strategy Perspectives</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage strategy perspectives for balanced scorecard
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Coming Soon</h2>
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-6">
            <p>
              The Strategy Perspective management feature is currently under development. 
              This will allow you to create and manage perspectives like:
            </p>
            <ul className="mt-2 list-disc list-inside text-left">
              <li>Financial</li>
              <li>Customer</li>
              <li>Internal Process</li>
              <li>Learning & Growth</li>
            </ul>
          </div>
          <p className="text-gray-600 mb-6">
            Strategy perspectives are the core categories in the balanced scorecard methodology, 
            which provide different viewpoints for measuring organizational performance.
          </p>
          <Link
            to="/performance/strategic-objectives"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Strategic Objectives Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StrategyPerspectiveList;
