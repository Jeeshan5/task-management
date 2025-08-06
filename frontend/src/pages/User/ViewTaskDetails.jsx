import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
// Assuming these imports exist—adjust paths as needed:
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";

// TodoCheckList and AvatarGroup from previous context:
const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm"
      />
      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
};

const AvatarGroup = ({ avatars, maxVisible }) => {
  // Shows up to maxVisible avatars (rest as "+N" badge)
  const visibleAvatars = avatars.slice(0, maxVisible || 3);
  const moreCount = avatars.length - visibleAvatars.length;
  return (
    <div className="flex items-center -space-x-2">
      {visibleAvatars.map((img, idx) =>
        img ? (
          <img
            key={idx}
            src={img}
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        ) : (
          <div
            key={idx}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border-2 border-white"
          >
            ?
          </div>
        )
      )}
      {moreCount > 0 && (
        <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 border-2 border-white">
          +{moreCount}
        </span>
      )}
    </div>
  );
};

// ---- ATTACHMENT ROW (from 4th screenshot) ----
const Attachment = ({ link, index, onClick }) => (
  <div
    className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex-1 flex items-center gap-3 border border-gray-100">
      <span className="text-xs font-semibold mr-2">{index < 9 ? `0${index + 1}` : index + 1}</span>
      <p className="text-xs text-black">{link}</p>
    </div>
    {/* Icon, e.g. for external link */}
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M14 3h7v7" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M10 14L21 3" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M21 14v7h-7" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M3 10L14 21" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  </div>
);

// ---- MAIN COMPONENT ----
const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  // Fetch task details by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  // Handle checklist change
  const updateTodoCheckList = async (index) => {
    // Add your API update logic here if desired
  };

  // Handle attachment link click (from screenshot 3)
  const handleLinkClick = (link) => {
    if (!/^https?:\/\//.test(link)) {
      link = "https://" + link; // Default to HTTPS if missing
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
    // eslint-disable-next-line
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">{task?.title}</h2>
            </div>
            <div
              className={`text-[13px] font-medium ${getStatusTagColor(
                task?.status
              )} px-4 py-0.5 rounded`}
            >
              {task?.status}
            </div>
            <div className="mt-4">
              <InfoBox label="Description" value={task?.description} />
              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("Do MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>
                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((item) => item.profileImageUrl) || []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>
            </div>

            <div className="mt-2">
              <label className="text-xs font-medium text-slate-500">
                Todo Checklist
              </label>
              <div>
                {task?.todoChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item.completed}
                    onChange={() => updateTodoCheckList(index)}
                  />
                ))}
              </div>
            </div>

            {/* Attachments section from screenshots */}
            {task?.attachments?.length > 0 && (
              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Attachments
                </label>
                {task.attachments.map((link, index) => (
                  <Attachment
                    key={`link_${index}`}
                    link={link}
                    index={index}
                    onClick={() => handleLinkClick(link)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Used throughout
const InfoBox = ({ label, value }) => (
  <>
    <label className="text-xs font-medium text-slate-500">{label}</label>
    <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
      {value}
    </p>
  </>
);

export default ViewTaskDetails;
