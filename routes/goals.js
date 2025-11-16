const express = require("express");
const router = express.Router();
const {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  addToGoal,
  getGoalStats,
  syncGoalWithTransactions
} = require("../controllers/goalController");

// Get all goals
router.get("/", getGoals);

// Get goal stats
router.get("/stats/summary", getGoalStats);

// Get single goal
router.get("/:id", getGoalById);

// Create new goal
router.post("/", createGoal);

// Update goal
router.put("/:id", updateGoal);

// Delete goal
router.delete("/:id", deleteGoal);

// Add amount to goal manually
router.post("/:id/add", addToGoal);

// Sync goal with transactions
router.post("/:id/sync", syncGoalWithTransactions);

module.exports = router;
