const { GoogleGenerativeAI } = require("@google/generative-ai");
const Transaction = require("../models/Transaction");
const Debt = require("../models/Debt");
const Goal = require("../models/Goal");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    const [transactions, debts, goals, user] = await Promise.all([
      Transaction.find({ userId }).sort({ date: -1 }).limit(50),
      Debt.find({ userId }),
      Goal.find({ userId }),
      User.findById(userId)
    ]);

    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);

    const categoryBreakdown = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

    const financialContext = `
You are WealthOS, a personal AI financial advisor. Be concise, friendly, and specific.
Always respond in the context of the user's actual financial data below.

USER FINANCIAL SUMMARY:
- Monthly Income: ₹${user.monthlyIncome || totalIncome}
- Total Expenses (last 50 transactions): ₹${totalExpenses}
- Total Remaining Debt: ₹${totalDebt}
- Total Saved towards goals: ₹${totalSaved}
- Spending by category: ${JSON.stringify(categoryBreakdown)}
- Active debts: ${debts.map(d => `${d.name} (₹${d.remainingAmount} at ${d.interestRate}% interest)`).join(", ") || "None"}
- Savings goals: ${goals.map(g => `${g.name} (₹${g.savedAmount}/₹${g.targetAmount})`).join(", ") || "None"}

Answer the user's question using this data. Give specific numbers and actionable advice.
Keep response under 150 words.
    `;

    let reply = "";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(financialContext + "\n\nUser: " + message);
      reply = result.response.text();
    } catch (aiErr) {
      console.error("Gemini error:", aiErr.message);
      // Smart fallback using real user data
      const topCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];
      reply = `Based on your finances: you have ₹${totalExpenses.toLocaleString("en-IN")} in expenses, ₹${totalDebt.toLocaleString("en-IN")} in total debt, and ₹${totalSaved.toLocaleString("en-IN")} saved towards goals. ${topCategory ? `Your biggest spending category is ${topCategory[0]} at ₹${topCategory[1].toLocaleString("en-IN")}.` : ""} I'd recommend focusing on your highest interest debt first and keeping expenses under 70% of your monthly income.`;
    }

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { chat };