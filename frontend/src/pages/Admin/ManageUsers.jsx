import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../components/Cards/UserCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userId));
      toast.success("User deleted successfully");
      setAllUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user");
    }
  };

  // Download report (placeholder)
  const handleDownloadReport = async () => {
    // Implementation coming soon
  };

  useEffect(() => {
    getAllUsers();
    return () => {
      setAllUsers([]);
    };
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Team Members</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report 
          </button>
        </div>

        <div className="overflow-x-auto">
          {allUsers.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            allUsers.map((user) => (
              <UserCard
                key={user._id}
                userInfo={user}
                onDelete={handleDeleteUser}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
