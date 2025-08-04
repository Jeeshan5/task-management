import React from 'react';

const CustomLegend = ({ payload }) => {
  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4 px-4">
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className="flex items-center space-x-2 text-gray-700 text-sm"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium truncate">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
