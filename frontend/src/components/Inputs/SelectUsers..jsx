import React, { useEffect, useState } from "react";
import { API_PATHS } from '../../utils/apiPaths';
import Modal from "../../components/Modal";
import axiosInstance from "../../utils/axiosInstance";
import { LuUsers } from "react-icons/lu";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Toggle checkbox selection
  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Save and close modal
  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  // Get selected avatars
  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl || "/default-avatar.png");

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    } else {
      setTempSelectedUsers(selectedUsers);
    }
  }, [selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {/* Display selected avatars or Add button */}
      {selectedUserAvatars.length === 0 ? (
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <LuUsers className="text-base" />
          Add Members
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {selectedUserAvatars.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
            />
          ))}
          <button
            className="text-sm text-blue-500 hover:underline ml-2"
            onClick={() => setIsModalOpen(true)}
          >
            Edit
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          {allUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No users available.</p>
          ) : (
            allUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                <img
                  src={user.profileImageUrl || "/default-avatar.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover mr-3 border"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
            ))
          )}
        </div>

        {/* Modal buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
            onClick={handleAssign}
          >
            Assign
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
