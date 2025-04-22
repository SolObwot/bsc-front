import React from 'react';
import PropTypes from 'prop-types';

const ObjectiveTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        <button 
          className={`py-2 px-4 text-sm bg-gray-100 font-medium ${activeTab === 'active' ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('active')}
        >
          Quantitative Objectives
        </button>
        <button 
          className={`py-2 px-4 text-sm bg-gray-100 font-medium ${activeTab === 'draft' ? 'text-teal-700 border-b-2 border-okr-blue' : 'text-gray-500'}`}
          onClick={() => setActiveTab('draft')}
        >
          Qualitative Objectives
        </button>
      </div>
    </div>
  );
};

ObjectiveTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default ObjectiveTabs;