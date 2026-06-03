const express = require("express");
const router = express.Router();
const { addDebt, getDebts, deleteDebt, optimizeDebts } = require("../controllers/debtController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/", addDebt);
router.get("/", getDebts);
router.delete("/:id", deleteDebt);
router.post("/optimize", optimizeDebts);

module.exports = router;