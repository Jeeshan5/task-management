const {Task} = require("../models/Task");
const { create } = require("../models/User");

//@desc Get all tasks
//@route GET /api/tasks
//@access Private (Admin: all, User: assigned)
const getTasks = async (req, res) => {
 try {
      const {status} = req.query;
        let filter = {};
        if (status) {
            filter.status = status;
        }
       
        let tasks;
        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate( 
                "assignedTo",
                 "name email profileImageUrl"
                );
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate("assignedTo",
                 "name email profileImageUrl"
                );
        }
        //add todo checklist count to each task
        tasks = await Promise.all(tasks.map(async (task) => {
            const completedCount = task.todoChecklist.filter(item => item.completed).length;
            return {
                ...task._doc,
               completedTodoCount: completedCount
            };
        }));
        //Status summary counts
        const allTasksCount = await Task.countDocuments( req.user.role !=="admin" ? {} : 
            { assignedTo: req.user._id } );
        const pendingTasksCount = await Task.countDocuments({ ...filter,
             status: "Pending",
             ...(req.user.role !== "admin" ? {} : { assignedTo: req.user._id }) });
        const inProgressTasksCount = await Task.countDocuments({ ...filter,
             status: "In Progress",
             ...(req.user.role !== "admin" ? {} : { assignedTo: req.user._id }) });
        const completedTasks = await Task.countDocuments({ ...filter,
             status: "Completed",
             ...(req.user.role !== "admin" ? {} : { assignedTo: req.user._id }) });
             res.json({
            tasks,
            statusSummary: {
                allTasksCount,
                pendingTasksCount,
                inProgressTasksCount,
                completedTasks
            }
        });

    }
 
 catch (error) {
   res.status(500).json({ message:"server error",error: error.message });
 }
};

//@desc Get task by ID
//@route GET /api/tasks/:id
//@access Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("assignedTo", 
            "name email profileImageUrl");

        if (!task) 
            return res.status(404).json({ message: "Task not found" });
        res.json(task);

 }
 catch (error) {
   res.status(500).json({ message:"server error",error: error.message });
 }
};
//@desc Create a task
//@route POST /api/tasks
//@access Private (Admin only)
const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo ,priority,dueDate,attachments ,todoChecklist} = req.body;
      if(!Array.isArray(assignedTo)){
          return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
      }
      const task = await Task.create({
          title,
          description,
          assignedTo,
          priority,
          dueDate,
          createdBy: req.user._id,
          attachments,
          todoChecklist
      });
      
      res.status(201).json({ message: "Task created successfully", task });
 }
 catch (error) {
   res.status(500).json({ message:"server error",error: error.message });
 }
};

//@desc Update task details
//@route PUT /api/tasks/:id
//@access Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        // task.assignedTo = req.body.assignedTo || task.assignedTo;
        task.attachments = req.body.attachments || task.attachments;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;

        if (req.body.assignedTo ){
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo;
        }
        const updatedTask = await task.save();
        res.json({ message: "Task updated successfully", task: updatedTask });
    }
    catch (error) {
   res.status(500).json({ message:"server error",error: error.message });
   }
  
    };

//@desc Delete a task
//@route DELETE /api/tasks/:id
//@access Private (Admin only)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.deleteOne();
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message:"server error",error: error.message });
    }
};

//@desc Update task status
//@route PUT /api/tasks/:id/status
//@access Private
const updateTaskStatus = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user._id.toString());

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }
        task.status = req.body.status || task.status;
        if (task.status === "Completed") {
            task.todoChecklist.forEach(item => {
                item.completed = true;
            });
            task.progress = 100;
             task.completed = true; 
        }
            await task.save();
        res.json({ message: "Task status updated successfully", task });
    }
    catch (error) {
        res.status(500).json({ message:"server error",error: error.message });
    }
};

//@desc Update task checklist
//@route PUT /api/tasks/:id/todo
//@access Private
const updateTaskChecklist = async (req, res) => {
    try {
        const {todoChecklist} = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if(!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }
        task.todoChecklist = todoChecklist;
        //Automatically update progress based on completed items
        const completedCount = todoChecklist.filter(item => item.completed).length;
        const totalItems = todoChecklist.length;
        task.progress = Math.round((completedCount / totalItems) * 100);

        //Automatically mark task as completed if all items are done
       if (task.progress === 100) {
    task.status = "Completed";
    task.completed = true;
      } else if (task.progress < 100 ) {
    task.status = "In Progress";
    task.completed = false;  
     } else {
    task.status = "Pending";
    task.completed = false;  
       }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate("assignedTo",
            "name email profileImageUrl");
        res.json({ message: "Task checklist updated successfully", task: updatedTask });


    } catch (error) {
        res.status(500).json({ message:"server error",error: error.message });
    }
};

//@desc Get dashboard data(Admin only)
//@route GET /api/tasks/dashboard-data
//@access Private
const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: "Completed" }
        });

        const rawTaskDistribution = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskStatuses = ["pending", "inprogress", "completed"];
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const match = rawTaskDistribution.find(item =>
                item._id?.replace(/\s+/g, "").toLowerCase() === status
            );
            acc[status] = match?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        const rawPriorityLevels = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskPriorities = ["low", "medium", "high"];
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            const match = rawPriorityLevels.find(item =>
                item._id?.toLowerCase() === priority
            );
            acc[priority] = match?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                completedTasks,
                pendingTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        });

    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
};




//@desc Get user dashboard data
//@route GET /api/tasks/user-dashboard-data
//@access Private   
const getUserDashboardData = async (req, res) => {
    try { 

        const userId = req.user._id;// Get the user ID from the authenticated user


        //fetch statistics for the user-specific tasks
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            dueDate: { $lt: new Date() },
            status: { $ne: "Completed" }
        });

        //task distribution for the user
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find(item =>
                item._id?.replace(/\s+/g, "").toLowerCase() === status.toLowerCase()
            )?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        //task priority levels for the user
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);


        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) =>
                item._id === priority)?.count || 0;
                        return acc;
        }, {});
        //fetch recent 10 tasks for the user
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                completedTasks,
                pendingTasks,
                overdueTasks
            },charts: { 
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks,
        });

    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
