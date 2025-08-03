const express = require("express");

const { protect, adminonly } = require("../middleware/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");
const router = express.Router();

//user management routes
router.get("/", protect,adminonly,getUsers);//get all users admin only
router.get("/:id", protect,getUserById);// get a specific user

router.delete("/:id", protect,adminonly,deleteUser);//delete a user admin only  

module.exports = router;
