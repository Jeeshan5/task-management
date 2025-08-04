import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: []
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData(prevData => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: []
    });
  };

  // CRUD Functions - details to be implemented
  const createTask = async () => {};
  const updateTask = async () => {};
  const handleSubmit = async () => {};
  const getTaskDetailsByID = async () => {};
  const deleteTask = async () => {};

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="form-card col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-sm font-medium text-rose-500 hover:text-rose-600"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Task Title
                </label>
                <input
                  placeholder="Create App UI"
                  className="form-input w-full"
                  value={taskData.title}
                  onChange={({ target }) => handleValueChange("title", target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Write task description here..."
                  className="form-input w-full h-28 resize-none"
                  value={taskData.description}
                  onChange={({ target }) => handleValueChange("description", target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="col-span-6 sm:col-span-4">
                <label className=" text-sm font-medium text-slate-600 mb-1">
                  Priority
                </label>
                <selectDropdown
                 options={PRIORITY_DATA}
                 value={taskData.priority}
                 onChange={handleValueChange}
                 placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label className=" text-sm font-medium text-slate-600 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-input w-full"
                  value={taskData.dueDate}
                  onChange={({ target }) => handleValueChange("dueDate", target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
