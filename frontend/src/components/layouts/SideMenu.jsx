import React, { useContext, useEffect, useState } from "react";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { HiOutlineX } from "react-icons/hi";

const SideMenu = ({ activeMenu, onClose }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
    if (onClose) onClose(); // close mobile drawer after navigation
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
    if (onClose) onClose(); // close mobile drawer after logout
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Mobile Header with Close Button */}
      {onClose && (
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Menu</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <HiOutlineX className="text-xl text-gray-600" />
          </button>
        </div>
      )}

      {/* User Profile Section */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5 px-4">
        <img
          alt="Profile"
          src={user?.profileImageUrl || "/placeholder-user.jpg"}
          className="w-20 h-20 bg-slate-400 rounded-full object-cover border-4 border-gray-100"
        />
        {user?.role && (
          <div
            className={`text-[10px] font-medium text-white px-3 py-0.5 rounded mt-2 ${
              user.role === "admin" ? "bg-purple-600" : "bg-blue-500"
            }`}
          >
            {user.role === "admin" ? "Admin" : "User"}
          </div>
        )}
        <h5 className="text-gray-950 font-medium leading-6 mt-3 text-center">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-500 text-center">{user?.email || ""}</p>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] transition-all duration-200 ${
              activeMenu === item.label
                ? "text-blue-600 bg-gradient-to-r from-blue-50/60 to-blue-100/60 border-r-4 border-blue-500 font-medium"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            } py-3 px-6 mb-1 cursor-pointer`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon 
              className={`text-lg ${
                activeMenu === item.label ? "text-blue-600" : "text-gray-500"
              }`} 
            />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;