const { Task } = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc Get all users (admin only)
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    // Add task counts
    const usersWithTasksCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "pending" });
        const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "in-progress" });
        const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "completed" });

        return {
          ...user.toObject(),
          pendingTasks,
          inProgressTasks,
          completedTasks
        };
      })
    );

    res.json(usersWithTasksCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete user (admin only)
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUser, // ✅ added this line
};
