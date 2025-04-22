import React from 'react';
import { InformationCircleIcon as Info } from '@heroicons/react/20/solid';

import PropTypes from 'prop-types';

const OverallProgress = ({ progress, riskStatus }) => {
    return (
      <div className="flex items-center px-4 py-2">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Overall Progress:</span>
          <span className="text-sm font-bold text-orange-600 mr-2">{progress}%</span>
          {riskStatus && (
            <span className="bg-red-200 text-teal-900 text-xs font-medium px-2 py-1 rounded">At Risk</span>
          )}
        </div>
        <button className="ml-2">
          <Info size={16} className="text-blue-500" />
        </button>
      </div>
    );
  };
  
  OverallProgress.propTypes = {
    progress: PropTypes.number.isRequired,
    riskStatus: PropTypes.bool.isRequired,
  };
  
  export default OverallProgress;