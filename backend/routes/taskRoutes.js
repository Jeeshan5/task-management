const express = require('express');
const { protect, adminonly } = require('../middleware/authMiddleware');
const { getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, getDashboardData } = require('../controllers/taskController');

const router = express.Router();

//task management routes
router.get("/dashboard-data", protect,getDashboardData); //get dashboard data (Admin only)
router.get("/user-dashboard-data", protect,getUserDashboardData);
router.get("/", protect, getTasks); //get all tasks admin:all,user:assigned
router.get("/:id", protect,getTaskById);//get task by ID
router.post("/", protect, adminonly, createTask);//create a task admin only
router.put("/:id", protect, updateTask);//update task  details 
router.delete("/:id", protect, adminonly, deleteTask); //delete task (admin only )
router.put("/:id/status", protect, updateTaskStatus);//update task status
router.put("/:id/todo", protect, updateTaskChecklist);//update task task checklist

module.exports = router;
