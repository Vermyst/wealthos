const Goal = require("../models/Goal");

// ADD goal
const addGoal = async (req, res) => {
  try {
    const { name, targetAmount, savedAmount, priority, deadline } = req.body;
    const goal = await Goal.create({
      userId: req.user._id, name, targetAmount,
      savedAmount: savedAmount || 0, priority: priority || 1, deadline
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ priority: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE goal (add savings)
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE goal
const deleteGoal = async (req, res) => {
  try {
    await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GREEDY allocator — distribute monthly savings across goals by priority
const allocateGoals = async (req, res) => {
  try {
    const { monthlySavings } = req.body;
    const goals = await Goal.find({ userId: req.user._id }).sort({ priority: -1 });

    if (goals.length === 0) return res.status(400).json({ message: "No goals found" });

    // Greedy DSA — fill highest priority goal first, move to next when full
    let budget = monthlySavings;
    const allocations = [];

    for (const goal of goals) {
      const remaining = goal.targetAmount - goal.savedAmount;
      if (remaining <= 0) {
        allocations.push({ name: goal.name, allocate: 0, status: "completed" });
        continue;
      }
      const allocate = Math.min(budget, remaining);
      budget -= allocate;
      allocations.push({
        name: goal.name,
        allocate: Math.round(allocate),
        remaining: Math.round(remaining),
        priority: goal.priority,
        status: allocate >= remaining ? "will complete" : "partial",
        monthsLeft: allocate > 0 ? Math.ceil(remaining / allocate) : null
      });
      if (budget <= 0) break;
    }

    res.json({ allocations, budgetLeft: Math.round(budget) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addGoal, getGoals, updateGoal, deleteGoal, allocateGoals };