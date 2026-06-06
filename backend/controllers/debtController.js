const Debt = require("../models/Debt");
const { execFile } = require("child_process");
const path = require("path");

// ADD debt
const addDebt = async (req, res) => {
  try {
    const { name, totalAmount, remainingAmount, interestRate, minimumPayment, dueDate } = req.body;
    const debt = await Debt.create({
      userId: req.user._id, name, totalAmount,
      remainingAmount, interestRate, minimumPayment, dueDate
    });
    res.status(201).json(debt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all debts
const getDebts = async (req, res) => {
  try {
    const debts = await Debt.find({ userId: req.user._id });
    res.json(debts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE debt
const deleteDebt = async (req, res) => {
  try {
    await Debt.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// OPTIMIZE debt payoff (calls C++ binary)
const optimizeDebts = async (req, res) => {
  try {
    const { monthlyBudget } = req.body;
    const debts = await Debt.find({ userId: req.user._id });
    if (debts.length === 0) return res.status(400).json({ message: "No debts found" });

    // Simplify debt objects — only send what C++ needs
    const simplifiedDebts = debts.map(d => ({
      name: d.name,
      remainingAmount: d.remainingAmount,
      interestRate: d.interestRate,
      minimumPayment: d.minimumPayment
    }));

    const input = JSON.stringify({ monthlyBudget, debts: simplifiedDebts });
    const binaryPath = path.join(
      __dirname,
      "../utils",
      process.env.NODE_ENV === "production" ? "debt_optimizer_linux" : "debt_optimizer.exe"
    );

    let output = "";
    let errorOutput = "";

    const child = execFile(binaryPath, [], { timeout: 10000 });

    child.stdout.on("data", (data) => { output += data; });
    child.stderr.on("data", (data) => { errorOutput += data; });

    child.on("close", (code) => {
      if (code !== 0) return res.status(500).json({ message: "Optimizer failed", error: errorOutput });
      try {
        res.json(JSON.parse(output));
      } catch (e) {
        res.status(500).json({ message: "Parse error", raw: output, error: e.message });
      }
    });

    child.stdin.write(input);
    child.stdin.end();

  } catch (err) {
    console.error("Optimizer error:", err.message, err.stack);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addDebt, getDebts, deleteDebt, optimizeDebts };