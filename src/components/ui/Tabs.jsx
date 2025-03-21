import React from 'react';
import clsx from 'clsx';

const Tabs = ({ tabs, activeTab, setActiveTab, renderContent, sidebarHeader }) => {
  return (
    <div className="flex h-full bg-gray-50 rounded-lg shadow-sm mt-10 overflow-hidden">
      {/* Sidebar with tabs */}
      <div className="w-64 bg-gray-50 border-r border-gray-400 shadow-lg flex flex-col">
        {sidebarHeader}
        <div className="flex-1 overflow-y-auto">
          {Object.keys(tabs).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={clsx(
                'w-full text-left px-4 py-3 transition-colors',
                'hover:bg-gray-100 focus:outline-none focus:ring-green-500',
                {
                  'bg-white border-l-4 border-[#08796c] font-medium': activeTab === tabKey,
                  'border-l-4 border-transparent': activeTab !== tabKey
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
