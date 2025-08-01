require("dotenv").config();
const express = require("express");

const cors = require("cors");
const path=require("path");
// const authRoutes = require("./routes/auth");
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


// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);

//Start Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
