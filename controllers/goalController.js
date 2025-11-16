const Goal = require("../models/goal");
const Transaction = require("../models/transaction");

// @desc    Get all goals
// @route   GET /api/goals
// @access  Public (can be protected later)
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single goal by ID
// @route   GET /api/goals/:id
// @access  Public
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Public
exports.createGoal = async (req, res) => {
  try {
    const { title, description, targetAmount, currentAmount, deadline, category, autoTrack } = req.body;

    // Validation
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ message: "Please provide title, target amount, and deadline" });
    }

    const goal = new Goal({
      title,
      description,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      category: category || "General",
      autoTrack: autoTrack || false
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Public
exports.updateGoal = async (req, res) => {
  try {
    const { title, description, targetAmount, currentAmount, deadline, category, status, autoTrack } = req.body;

    let goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Update fields
    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetAmount) goal.targetAmount = targetAmount;
    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (deadline) goal.deadline = deadline;
    if (category) goal.category = category;
    if (status) goal.status = status;
    if (autoTrack !== undefined) goal.autoTrack = autoTrack;

    // Auto-complete if target reached
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Public
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    await goal.deleteOne();
    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add amount to goal manually
// @route   POST /api/goals/:id/add
// @access  Public
exports.addToGoal = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Please provide a valid amount" });
    }

    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.currentAmount += parseFloat(amount);

    // Auto-complete if target reached
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get goal statistics
// @route   GET /api/goals/stats/summary
// @access  Public
exports.getGoalStats = async (req, res) => {
  try {
    const goals = await Goal.find();

    const stats = {
      totalGoals: goals.length,
      activeGoals: goals.filter(g => g.status === "active").length,
      completedGoals: goals.filter(g => g.status === "completed").length,
      totalTargetAmount: goals.reduce((sum, g) => sum + g.targetAmount, 0),
      totalSavedAmount: goals.reduce((sum, g) => sum + g.currentAmount, 0),
      totalRemaining: goals.reduce((sum, g) => sum + (g.targetAmount - g.currentAmount > 0 ? g.targetAmount - g.currentAmount : 0), 0),
      overallProgress: 0
    };

    if (stats.totalTargetAmount > 0) {
      stats.overallProgress = Math.round((stats.totalSavedAmount / stats.totalTargetAmount) * 100);
    }

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Sync goal with transactions (for auto-tracking)
// @route   POST /api/goals/:id/sync
// @access  Public
exports.syncGoalWithTransactions = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Calculate savings from transactions since goal creation
    const savingsTransactions = await Transaction.find({
      type: "income",
      date: { $gte: goal.createdAt }
    });

    const totalSavings = savingsTransactions.reduce((sum, t) => sum + t.amount, 0);

    goal.currentAmount = totalSavings;

    // Auto-complete if target reached
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
