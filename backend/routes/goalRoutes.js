const express = require("express");
const router = express.Router();
const { addGoal, getGoals, updateGoal, deleteGoal, allocateGoals } = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/", addGoal);
router.get("/", getGoals);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
router.post("/allocate", allocateGoals);

module.exports = router;