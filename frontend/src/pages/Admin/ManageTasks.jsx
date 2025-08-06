import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  // Fetch all tasks with optional status filter
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      const tasks = response.data?.tasks || [];
      setAllTasks(tasks);

      const summary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: tasks.length },
        { label: "Pending", count: tasks.filter(task => task.status === "Pending").length },
        { label: "In Progress", count: tasks.filter(task => task.status === "In Progress").length },
        { label: "Completed", count: tasks.filter(task => task.status === "Completed").length },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks.");
    }
  };

  // Navigate to Edit Task page
  const handleEditTask = (taskData) => {
    navigate("/admin/create-task", { state: { taskId: taskData?._id } });
  };

  // Placeholder for downloading reports
  const handleDownloadReport = async () => {
    // TODO: Add export logic using API_PATHS.REPORTS.EXPORT_TASKS
  };

  // Fetch tasks when filter changes
  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Tasks</h2>
          <button
            onClick={handleDownloadReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Download Report
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setFilterStatus(tab.label)}
              className={`px-4 py-2 rounded-md border transition ${
                filterStatus === tab.label
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allTasks.length === 0 ? (
            <p className="text-gray-500 col-span-full">No tasks found.</p>
          ) : (
            allTasks.map((task) => (
              <div
                key={task._id}
                className="p-4 border rounded-md shadow-sm bg-white hover:shadow-md cursor-pointer"
                onClick={() => handleEditTask(task)}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Status: <span className="font-medium">{task.status}</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Priority: <span className="font-medium capitalize">{task.priority}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import { API_PATHS } from "../../utils/apiPaths";
// import DashboardLayout from "../../components/layouts/DashboardLayout";
// import toast from "react-hot-toast";
// import { LuFileSpreadsheet } from "react-icons/lu";
// import TaskStatusTabs from "../../components/TaskStatusTabs";
// import TaskCard from "../../components/cards/TaskCard";

// const ManageTasks = () => {
//   const [allTasks, setAllTasks] = useState([]);
//   const [tabs, setTabs] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const navigate = useNavigate();

//   const getAllTasks = async () => {
//     try {
//       const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
//         params: {
//           filterStatus: filterStatus === "All" ? "" : filterStatus,
//         },
//       });

//       const tasks = response.data?.tasks || [];
//       const tabCounts = response.data?.statusCount || [];

//       setAllTasks(tasks);
//       setTabs(tabCounts);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       toast.error("Failed to fetch tasks.");
//     }
//   };

//   const handleEditTask = (task) => {
//     if (task?._id) {
//       navigate(`/user/tasks/${task._id}`);
//     } else {
//       toast.error("Task ID is missing.");
//     }
//   };

//   const handleDownloadReport = async () => {
//     try {
//       const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
//         responseType: "blob",
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "task_details.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error downloading task details:", error);
//       toast.error("Failed to download task details. Please try again.");
//     }
//   };

//   useEffect(() => {
//     getAllTasks();
//   }, [filterStatus]);

//   return (
//     <DashboardLayout activeMenu="Manage Tasks">
//       <div className="my-3">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl md:text-xl font-medium">Manage Tasks</h2>

//           <button className="flex lg:hidden download-btn" onClick={handleDownloadReport}>
//             <LuFileSpreadsheet className="text-lg" />
//             Download Report
//           </button>
//         </div>

//         {tabs.length > 0 && (
//           <div className="flex items-center gap-3">
//             <TaskStatusTabs
//               tabs={tabs}
//               activeTab={filterStatus}
//               setActiveTab={setFilterStatus}
//             />
//           </div>
//         )}

//         <button className="hidden lg:flex download-btn" onClick={handleDownloadReport}>
//           <LuFileSpreadsheet className="text-lg" />
//           Download Report
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//         {allTasks.map((item, index) => (
//           <TaskCard
//             key={item?._id || index}
//             title={item?.title?.trim() || "Untitled Task"}
//             description={item?.description?.trim() || "No description available"}
//             priority={item?.priority || "low"}
//             status={item?.status || "todo"}
//             progress={typeof item?.progress === "number" ? item.progress : 0}
//             createdAt={item?.createdAt || new Date().toISOString()}
//             dueDate={item?.dueDate || null}
//             assignedTo={
//               Array.isArray(item?.assignedTo)
//                 ? item.assignedTo.map((person) => person?.profileImageUrl || "")
//                 : []
//             }
//             attachmentsCount={
//               Array.isArray(item?.attachments) ? item.attachments.length : 0
//             }
//             completedTodoCount={item?.completedTodoCount || 0}
//             todoCheckList={
//               Array.isArray(item?.todoCheckList) ? item.todoCheckList : []
//             }
//             onClick={() => handleEditTask(item)}
//           />
//         ))}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ManageTasks;
