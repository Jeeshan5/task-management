const express = require("express");
const { adminonly, protect } = require("../middleware/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");
const router = express.Router();

router.get("/export/tasks",protect,adminonly,exportTasksReport); // Export tasks as Excel/PDF (Admin only)
router.get("/export/users", protect, adminonly, exportUsersReport); // Export users as Excel/PDF (Admin only)
module.exports = router;