const Transaction = require("../models/Transaction");
const Trie = require("../utils/Trie");

const autocomplete = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) return res.json([]);

    // Build Trie from user's transaction titles
    const transactions = await Transaction.find({ userId: req.user._id }).select("title");
    const trie = new Trie();
    const seen = new Set();
    transactions.forEach(t => {
      const key = t.title.toLowerCase().trim();
      if (!seen.has(key)) { trie.insert(t.title); seen.add(key); }
    });

    const results = trie.search(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { autocomplete };