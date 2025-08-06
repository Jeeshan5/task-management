import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers.';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: []
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: []
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        priority: taskData.priority.toLowerCase(),
        todoChecklist: todolist,
        dueDate: new Date(taskData.dueDate).toISOString(),
        assignedTo: taskData.assignedTo.map((user) => user._id || user),
      });

      toast.success("Task created successfully!");
      clearData();
      navigate("/tasks");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data || error);
      toast.error("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const prevChecklist = currentTask?.todoChecklist || [];

      const transformedChecklist = taskData.todoChecklist.map((item) => {
        const matchedItem = prevChecklist.find((t) => t.text === item);
        return {
          text: item,
          completed: matchedItem ? matchedItem.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        priority: taskData.priority.toLowerCase(),
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: transformedChecklist,
        assignedTo: taskData.assignedTo
          .filter((user) => user)
          .map((user) => (typeof user === 'object' ? user._id : user)),
      });

      toast.success("Task updated successfully!");
      clearData();
      navigate("/tasks");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data || error);
      toast.error("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!taskData.title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Task description is required.");
      return;
    }
    if (taskData.assignedTo.length === 0) {
      setError("At least one user must be assigned to the task.");
      return;
    }
    if (!taskData.todoChecklist.length) {
      setError("At least one TODO item is required.");
      return;
    }
    if (taskId) {
      await updateTask();
      return;
    }
    createTask();
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);
        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format("YYYY-MM-DD") : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item.id) || [],
          todoChecklist: taskInfo?.todoChecklist?.map((item) => item.text) || [],
          attachments: taskInfo?.attachments || []
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  // ✅ Delete task implementation
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully!");
      setOpenDeleteAlert(false);
      navigate("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID(taskId);
    }
  }, [taskId]);

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
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            {/* Title & Description */}
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

            {/* Priority, Due Date, Assignees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(val) => handleValueChange("priority", val)}
                  placeholder="Select Priority"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-input w-full"
                  value={taskData.dueDate ?? ""}
                  onChange={({ target }) => handleValueChange("dueDate", target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-600 mb-1">
                  Assigned To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(users) => handleValueChange("assignedTo", users)}
                  placeholder="Select Users"
                />
              </div>
            </div>

            {/* TODO Checklist */}
            <div className="mt-6">
              <label className="text-sm font-medium text-slate-600 mb-2 block">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) => handleValueChange("todoChecklist", value)}
              />
            </div>

            {/* Attachments */}
            <div className="mt-6">
              <label className="text-sm font-medium text-slate-600 mb-2 block">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) => handleValueChange("attachments", value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : taskId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task? This action cannot be undone."
          onDelete={deleteTask}
          onCancel={() => setOpenDeleteAlert(false)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
