import React from "react";
import InfoCard from "./InfoCard";
import { LuMail, LuUser, LuTrash2 } from "react-icons/lu";

const UserCard = ({ userInfo, onDelete }) => {
  const {
    _id,
    name = "Unnamed User",
    email = "No email provided",
    role = "member",
    profileImageUrl,
  } = userInfo || {};

  const roleDisplay = role === "admin" ? "Admin" : "Member";
  const roleColor = role === "admin" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <img
        src={profileImageUrl || "/placeholder-user.jpg"}
        alt={name}
        className="w-20 h-20 rounded-full object-cover bg-gray-200 border-2 border-gray-300"
      />

      <div className="flex-1 w-full">
        <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <LuUser className="text-gray-500" />
              {name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <LuMail className="text-gray-400" />
              {email}
            </p>
          </div>

          <button
            onClick={() => onDelete?.(_id)}
            className="mt-2 sm:mt-0 text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium"
          >
            <LuTrash2 className="text-lg" />
            Delete
          </button>
        </div>

        <div className="mt-3">
          <InfoCard label="Role" value={roleDisplay} color={roleColor} />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
