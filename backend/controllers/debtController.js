const Debt = require("../models/Debt");

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

    const n = debts.length;
    const names = debts.map(d => d.name);
    const remaining = debts.map(d => d.remainingAmount);
    const rates = debts.map(d => d.interestRate);
    const minPayments = debts.map(d => d.minimumPayment);

    const totalMin = minPayments.reduce((s, p) => s + p, 0);
    const extraBudget = Math.max(0, monthlyBudget - totalMin);

    // Simulate months to payoff
    const simulate = (payments) => {
      let balances = [...remaining];
      for (let month = 1; month <= 600; month++) {
        if (balances.every(b => b <= 0.01)) return month - 1;
        for (let i = 0; i < n; i++) {
          if (balances[i] <= 0.01) continue;
          balances[i] += balances[i] * (rates[i] / 100 / 12);
          balances[i] -= payments[i];
          if (balances[i] < 0) balances[i] = 0;
        }
        if (balances.every(b => b <= 0.01)) return month;
      }
      return -1;
    };

    // Strategy 1: Avalanche (highest interest first) — min-heap via sort
    const avalanche = [...minPayments];
    {
      const order = [...Array(n).keys()].sort((a, b) => rates[b] - rates[a]);
      let budget = extraBudget;
      for (const idx of order) {
        if (budget <= 0) break;
        const canPay = Math.min(budget, Math.max(0, remaining[idx] - minPayments[idx]));
        avalanche[idx] += canPay;
        budget -= canPay;
      }
    }

    // Strategy 2: Snowball (lowest balance first)
    const snowball = [...minPayments];
    {
      const order = [...Array(n).keys()].sort((a, b) => remaining[a] - remaining[b]);
      let budget = extraBudget;
      for (const idx of order) {
        if (budget <= 0) break;
        const canPay = Math.min(budget, Math.max(0, remaining[idx] - minPayments[idx]));
        snowball[idx] += canPay;
        budget -= canPay;
      }
    }

    // Strategy 3: DP Optimizer (maximize interest saved — knapsack)
    const optimized = [...minPayments];
    {
      const B = Math.min(Math.floor(extraBudget), 50000);
      const maxExtra = debts.map((d, i) =>
        Math.min(Math.max(0, Math.floor(d.remainingAmount - minPayments[i])), B)
      );
      const interestRate = rates.map(r => r / 100 / 12);

      // 1D DP — for each debt, try paying 0..maxExtra[i] extra
      const dp = Array(B + 1).fill(0);
      const choice = Array.from({ length: n }, () => new Array(B + 1).fill(0));

      // Full 2D DP for traceback
      const dpFull = Array.from({ length: n + 1 }, () => new Array(B + 1).fill(0));

      for (let i = 0; i < n; i++) {
        for (let j = 0; j <= B; j++) {
          dpFull[i + 1][j] = dpFull[i][j];
          for (let pay = 1; pay <= maxExtra[i] && pay <= j; pay++) {
            const gain = dpFull[i][j - pay] + pay * interestRate[i];
            if (gain > dpFull[i + 1][j] + 1e-12) {
              dpFull[i + 1][j] = gain;
            }
          }
        }
      }

      // Traceback
      let rem = B;
      for (let i = n - 1; i >= 0; i--) {
        let bestPay = 0;
        let bestVal = dpFull[i][rem];
        for (let pay = 1; pay <= maxExtra[i] && pay <= rem; pay++) {
          const val = dpFull[i][rem - pay] + pay * interestRate[i];
          if (val > bestVal + 1e-12) {
            bestVal = val;
            bestPay = pay;
          }
        }
        optimized[i] += bestPay;
        rem -= bestPay;
      }
    }

    const avalMonths = simulate(avalanche);
    const snowMonths = simulate(snowball);
    const dpMonths = simulate(optimized);

    res.json({
      avalanche: {
        months: avalMonths,
        payments: names.map((name, i) => ({ name, payment: Math.round(avalanche[i]) }))
      },
      snowball: {
        months: snowMonths,
        payments: names.map((name, i) => ({ name, payment: Math.round(snowball[i]) }))
      },
      optimized: {
        months: dpMonths,
        payments: names.map((name, i) => ({ name, payment: Math.round(optimized[i]) }))
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addDebt, getDebts, deleteDebt, optimizeDebts };