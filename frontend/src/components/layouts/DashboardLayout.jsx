import React from "react";
import Navbar from "./Navbar";

const DashboardLayout = ({ children, activeMenu }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar - handles all sidebar logic */}
      <Navbar activeMenu={activeMenu} />

      {/* Main Content - adjusted for desktop sidebar */}
      <main className="lg:ml-64 p-4 pt-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;