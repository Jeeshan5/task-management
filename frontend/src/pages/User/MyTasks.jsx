import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          filterStatus: filterStatus === "All" ? "" : filterStatus,
        },
      });

      const tasks = response.data?.tasks || [];
      const tabCounts = response.data?.statusCount || [];

      setAllTasks(tasks);
      setTabs(tabCounts);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ✅ Fixed route path here
  const handleClick = (taskId) => {
  navigate(`/user/tasks/${taskId}`);
};


  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading task details:", error);
      toast.error("Failed to download task details. Please try again.");
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

          <button className="flex lg:hidden download-btn" onClick={handleDownloadReport}>
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        {tabs.length > 0 && (
          <div className="flex items-center gap-3">
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          </div>
        )}

        <button className="hidden lg:flex download-btn" onClick={handleDownloadReport}>
          <LuFileSpreadsheet className="text-lg" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {allTasks.map((item, index) => (
          <TaskCard
            key={item?._id || index}
            title={item?.title?.trim() || "Untitled Task"}
            description={item?.description?.trim() || "No description available"}
            priority={item?.priority || "low"}
            status={item?.status || "todo"}
            progress={typeof item?.progress === "number" ? item.progress : 0}
            createdAt={item?.createdAt || new Date().toISOString()}
            dueDate={item?.dueDate || null}
            assignedTo={
              Array.isArray(item?.assignedTo)
                ? item.assignedTo.map((person) => person?.profileImageUrl || "")
                : []
            }
            attachmentsCount={
              Array.isArray(item?.attachments) ? item.attachments.length : 0
            }
            completedTodoCount={item?.completedTodoCount || 0}
            todoCheckList={
              Array.isArray(item?.todoCheckList) ? item.todoCheckList : []
            }
            onClick={() => handleClick(item?._id)}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
