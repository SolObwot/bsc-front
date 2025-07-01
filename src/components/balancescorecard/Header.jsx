'use client'

import React from 'react';

const ObjectiveHeader = ({ perspective = "Annual Review" }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full p-4 bg-[#08796c] text-white mt-8 rounded-t-lg">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold mr-1">{perspective}</h1>
      </div>
      <div className="text-sm mt-2 lg:mt-0">
        Current Performance Framework: <span className="font-bold">BALANCED SCORECARD</span>
      </div>
    </div>
  );
};

export default ObjectiveHeader;