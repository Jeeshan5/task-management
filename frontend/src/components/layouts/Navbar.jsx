import React, { useState, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const handleToggle = () => setOpenSideMenu(!openSideMenu);

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setOpenSideMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && openSideMenu) {
        setOpenSideMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [openSideMenu]);

  return (
    <>
      {/* Top Navbar */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-6 sticky top-0 z-50">
        <div className="flex items-center gap-5">
          {/* Mobile Menu Button */}
          <button
            className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded-md transition-colors"
            onClick={handleToggle}
            aria-label="Toggle menu"
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>
          
          {/* Title */}
          <div>
            <h2 className="text-lg font-medium lg:text-xl text-black">
              {activeMenu || 'Dashboard'}
            </h2>
          </div>
        </div>

        {/* Right side actions (optional) */}
        <div className="flex items-center gap-3">
          {/* Add any right-side content like user profile, notifications etc. */}
        </div>
      </div>

      {/* Mobile Sidebar Overlay & Menu */}
      {openSideMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={handleToggle}
          />
          
          {/* Mobile Sidebar */}
          <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl lg:hidden transform transition-transform duration-300">
            <div className="h-full overflow-y-auto">
              <SideMenu activeMenu={activeMenu} onClose={handleToggle} />
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar - Fixed positioning */}
      <div className="hidden lg:block fixed top-[73px] left-0 w-64 h-[calc(100vh-73px)] bg-white border-r border-gray-200/50 z-30 shadow-sm">
        <div className="h-full overflow-y-auto">
          <SideMenu activeMenu={activeMenu} />
        </div>
      </div>
    </>
  );
};

export default Navbar;