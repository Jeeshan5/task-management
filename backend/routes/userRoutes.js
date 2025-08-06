const express = require("express");
const { protect, adminonly } = require("../middleware/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");

const router = express.Router();

// User management routes
router.get("/", protect, adminonly, getUsers);       // Get all users (admin only)
router.get("/:id", protect, getUserById);            // Get a specific user

router.delete("/:id", protect, adminonly, deleteUser); // ✅ Delete a user (admin only)

module.exports = router;
