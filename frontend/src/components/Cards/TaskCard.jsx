import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const TaskCard = ({
  _id, // 👈 added to get task ID for navigation
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentsCount,
  completedTodoCount,
  todoCheckList,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (_id) {
      navigate(`/tasks/${_id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white shadow rounded-xl p-4 flex flex-col justify-between"
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {title || "Untitled Task"}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full capitalize ${
              status === "completed"
                ? "bg-green-100 text-green-700"
                : status === "in-progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {description || "No description"}
        </p>

        <div className="text-xs text-gray-500">
          <p>
            Due:{" "}
            {dueDate ? moment(dueDate).format("DD MMM YYYY") : "No due date"}
          </p>
          <p>Priority: {priority}</p>
        </div>
      </div>

      {/* Footer - avatars, progress, etc. */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex -space-x-2">
          {assignedTo?.map((url, idx) =>
            url ? (
              <img
                key={idx}
                src={url}
                alt="profile"
                className="w-6 h-6 rounded-full border"
              />
            ) : null
          )}
        </div>

        <div className="text-xs text-gray-500">
          {completedTodoCount}/{todoCheckList?.length || 0} completed
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
