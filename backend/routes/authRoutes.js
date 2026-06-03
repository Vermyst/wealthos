const express = require("express");
const router = express.Router();
const { register, login, logout, refresh, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", protect, getMe);

router.put("/update", protect, async (req, res) => {
  try {
    const user = await require("../models/User").findByIdAndUpdate(
      req.user._id,
      { $set: { monthlyIncome: req.body.monthlyIncome } },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;