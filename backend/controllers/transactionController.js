const Transaction = require("../models/Transaction");

// Keyword-based category tagger (DSA: HashMap)
const categoryMap = {
  food: ["zomato", "swiggy", "restaurant", "cafe", "pizza", "burger", "food"],
  transport: ["uber", "ola", "petrol", "fuel", "metro", "bus", "rapido"],
  shopping: ["amazon", "flipkart", "myntra", "mall", "store", "shop"],
  entertainment: ["netflix", "spotify", "prime", "hotstar", "cinema", "movie"],
  health: ["pharmacy", "doctor", "hospital", "gym", "medicine", "clinic"],
  utilities: ["electricity", "water", "wifi", "internet", "recharge", "bill"],
  education: ["udemy", "coursera", "books", "course", "tuition", "college"],
};

const categorize = (title) => {
  const lower = title.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(k => lower.includes(k))) return category;
  }
  return "other";
};

// ADD transaction
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, date } = req.body;
    const category = categorize(title);
    const transaction = await Transaction.create({
      userId: req.user._id, title, amount, type, category,
      date: date || Date.now()
    });
    
    // Socket.IO — check budget breach
    const io = req.app.get("io");
    if (type === "expense") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
      const expenses = await Transaction.find({
        userId: req.user._id, type: "expense",
        date: { $gte: startOfMonth }
      });
      const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
      const income = req.user.monthlyIncome;
      if (income > 0 && totalExpense > income * 0.9) {
        io.emit(`alert_${req.user._id}`, {
          message: `⚠️ You've used ${Math.round((totalExpense/income)*100)}% of your monthly income!`
        });
      }
    }

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE transaction
const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET spending analysis (DSA: Sliding window)
const getAnalysis = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const transactions = await Transaction.find({
      userId: req.user._id, type: "expense",
      date: { $gte: since }
    }).sort({ date: 1 });

    // Sliding window — daily spend totals
    const dailyMap = {};
    transactions.forEach(t => {
      const day = t.date.toISOString().split("T")[0];
      dailyMap[day] = (dailyMap[day] || 0) + t.amount;
    });

    // Category breakdown (HashMap)
    const categoryBreakdown = {};
    transactions.forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

    // Subscription detector — recurring titles (sliding window over 30 days)
    const titleFrequency = {};
    transactions.forEach(t => {
      const key = t.title.toLowerCase().trim();
      titleFrequency[key] = (titleFrequency[key] || 0) + 1;
    });
    const subscriptions = Object.entries(titleFrequency)
      .filter(([_, count]) => count >= 2)
      .map(([title, count]) => ({ title, count }));

    res.json({ dailySpend: dailyMap, categoryBreakdown, subscriptions,
      total: transactions.reduce((s, t) => s + t.amount, 0) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CSV upload
const uploadCSV = async (req, res) => {
  try {
    const { transactions } = req.body; // array parsed on frontend
    const docs = transactions.map(t => ({
      userId: req.user._id,
      title: t.title || t.description || "Unknown",
      amount: Math.abs(parseFloat(t.amount)),
      type: parseFloat(t.amount) < 0 ? "expense" : "income",
      category: categorize(t.title || t.description || ""),
      date: new Date(t.date) || Date.now()
    }));
    await Transaction.insertMany(docs);
    res.json({ message: `${docs.length} transactions imported` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addTransaction, getTransactions, deleteTransaction, getAnalysis, uploadCSV };