import React from 'react';

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
      <p className="text-center text-gray-700 mb-4">{content}</p>
      <div className="flex justify-center space-x-4">
        <button
          className="bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400 text-white px-4 py-2 rounded-lg transition-all duration-200"
          onClick={onDelete}
        >
          🗑 Delete
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
