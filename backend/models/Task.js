const mongoose = require("mongoose");

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
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
       
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    status: {
        type: String,
        enum: ["Pending", "In-progress", "Completed"],
        default: "Pending"
    },
    dueDate: {
        type: Date,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
         
    },
    createdBY: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       
    },
    attachments: [{
        type: String
    }],
    todoChecklist: [todoSchema], // Embedding todo schema for checklist items
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
}
     , { timestamps: true } // Automatically manage createdAt and updatedAt fields  
     );

const Todo = mongoose.model("Todo", todoSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = { Todo, Task };
