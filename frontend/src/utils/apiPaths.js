export const BASE_URL =  'http://localhost:8000';

//utils/apiPaths.js
export const API_PATHS = {
    AUTH:{
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  GET_PROFILE: "/api/auth/profile",
    },

    USERS:{
    GET_ALL_USERS: "/api/users", //get all users   
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,//get user by id
    CREATE_USER: "/api/users",//create new user admin only
    UPDATE_USER: (userId) => `/api/users/${userId}`,//update user by id admin only
    DELETE_USER: (userId) => `/api/users/${userId}`,//delete user by id admin only
    },
    TASKS:{
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", //get dashboard data
        GET_USER_DASHBOARD_DATA:  "/api/tasks/user-dashboard-data", //get user dashboard data
        GET_ALL_TASKS: "/api/tasks", //get all tasks
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, //get task by id
        CREATE_TASK: "/api/tasks", //create new task
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, //update task by id
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, //delete task by id

        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, //update task status by id
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, //update task checklist by id
    },

    REPORTS:{
        EXPORT_TASKS: "/api/reports/export/tasks", //export tasks report  as an excel sheet
        EXPORT_USERS: "/api/reports/export/users", //export users report as an excel sheet
    },
    IMAGE:{
         UPLOAD_IMAGE: "/api/auth/upload-image", //upload image
    },
};