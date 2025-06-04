import React from 'react';
import { Link } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';

const AddStrategyPerspective = () => {
  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Add Strategy Perspective</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create a new strategy perspective
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            The ability to add new strategy perspectives is currently being developed.
            Check back soon for updates.
          </p>
          <Link
            to="/performance/strategic-perspectives"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Perspectives
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddStrategyPerspective;
