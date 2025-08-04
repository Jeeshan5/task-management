import React from 'react';
import UI_IMG from '../../assets/images/ui-img.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full transition-all duration-300 ease-in-out overflow-hidden">
      
      {/* Left Side: Form + Heading */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 md:px-10 py-10 transition-all duration-300">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Task Manager</h2>
          {children}
        </div>
      </div>

      {/* Right Side: Image (only on large screens) */}
      <div className="hidden lg:flex w-1/2 min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
        <img
          src={UI_IMG}
          alt="UI Illustration"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
