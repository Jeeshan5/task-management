// src/components/TaskStatusTabs.jsx

import React from 'react';

const TaskStatusTabs = ({ tabs = [], activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-2 flex-wrap mt-4">
      {tabs.map((tab) => (
        <button
          key={tab.status}
          className={`px-3 py-1 rounded-full border text-sm ${
            activeTab === tab.status
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300'
          }`}
          onClick={() => setActiveTab(tab.status)}
        >
          {tab.status.charAt(0).toUpperCase() + tab.status.slice(1)} ({tab.count})
        </button>
      ))}
    </div>
  );
};

export default TaskStatusTabs;
