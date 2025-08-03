require("dotenv").config();
const express = require("express");

const cors = require("cors");
const path=require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
// const taskRoutes = require("./routes/task");

const app = express();

//Middle ware to handle CORS
app.use(cors( 
    {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
       allowedHeaders: ["Content-Type", "Authorization"]
    }
));
app.use(express.json());

//Connect to MongoDB
const connectDB = require('./config/db');
connectDB();


//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/reports", reportRoutes);

//Start Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
