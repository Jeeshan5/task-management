const Tasks = require('../models/Task');
const User = require('../models/User');
const excelJS = require('exceljs');

//desc Export tasks report as Excel
//route GET /api/reports/export/tasks
//access Admin only
const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Tasks.find().populate('assignedTo', 'name email');
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks Report');

        worksheet.columns = [
            { header: 'Task ID', key: '_id', width: 30 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Priority', key: 'priority', width: 15 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
            { header: 'Assigned To', key: 'assignedTo', width: 30 },
        ];

        tasks.forEach(task => {
            const assignedTo = task.assignedTo
                ? `${task.assignedTo.name} (${task.assignedTo.email})`
                : 'Unassigned';

            worksheet.addRow({
                _id: task._id.toString(),
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
                assignedTo: assignedTo
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=tasks_report.xlsx');

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });

    } catch (error) {
        res.status(500).json({ message: "Error Exporting the tasks", error: error.message });
    }
};

//desc Export users report as Excel
//route GET /api/reports/export/users
//access Admin only
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select('name email').lean();
        const tasks = await Tasks.find().populate('assignedTo', 'name email _id status');

        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0
            };
        });

        tasks.forEach((task) => {
            if (task.assignedTo) {
                const assignedUser = task.assignedTo;
                if (userTaskMap[assignedUser._id]) {
                    userTaskMap[assignedUser._id].taskCount += 1;
                    if (task.status === 'pending') {
                        userTaskMap[assignedUser._id].pendingTasks += 1;
                    } else if (task.status === 'in-progress') {
                        userTaskMap[assignedUser._id].inProgressTasks += 1;
                    } else if (task.status === 'completed') {
                        userTaskMap[assignedUser._id].completedTasks += 1;
                    }
                }
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users Task Report');

        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 30 },
            { header: "Total Tasks", key: "taskCount", width: 15 },
            { header: "Pending Tasks", key: "pendingTasks", width: 15 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 }
        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=users_report.xlsx');

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });

    } catch (error) {
        res.status(500).json({ message: "Error Exporting the users", error: error.message });
    }
};

module.exports = {
    exportTasksReport,
    exportUsersReport
};
