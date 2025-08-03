const mongoose = require("mongoose");

// Define the Todo schema
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Create the Todo model separately
const Todo = mongoose.model("Todo", todoSchema);

// Define the Task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    dueDate: {
        type: Date,
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    attachments: [{
        type: String
    }],
    // Embed todo items inside the Task
    todoChecklist: [todoSchema],
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Create the Task model
const Task = mongoose.model("Task", taskSchema);

// Export both models
module.exports = { Task, Todo };

