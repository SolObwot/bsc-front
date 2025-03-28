import React from 'react';
import clsx from 'clsx';

const Tabs = ({ tabs, activeTab, setActiveTab, renderContent, sidebarHeader }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-sm mt-10 overflow-hidden lg:flex-row">
      {/* Sidebar with tabs - becomes horizontal on mobile */}
      <div className="w-full bg-gray-50 border-b border-gray-400 shadow-lg flex flex-row overflow-x-auto lg:w-64 lg:border-r lg:border-b-0 lg:flex-col">
        {sidebarHeader}
        <div className="flex-1 flex flex-row lg:flex-col lg:overflow-y-auto">
          {Object.keys(tabs).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={clsx(
                'min-w-max text-left px-4 py-3 transition-colors',
                'hover:bg-gray-100 focus:outline-none focus:ring-green-500',
                {
                  'bg-white lg:border-l-4 border-b-4 lg:border-b-0 border-[#08796c] font-medium': activeTab === tabKey,
                  'lg:border-l-4 border-b-4 lg:border-b-0 border-transparent': activeTab !== tabKey
                }
              )}
            >
              {tabs[tabKey].label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 bg-white rounded-lg">
        {renderContent(activeTab)}
      </div>
    </div>
  );
};

export default Tabs;