import React from "react";
import Navbar from "./Navbar"; // ✅ Make sure path is correct
import SideMenu from "./SideMenu"; // ✅ Make sure path is correct

const DashboardLayout = ({ children, activeMenu }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar activeMenu={activeMenu} />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200">
          <SideMenu activeMenu={activeMenu} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
