const express = require("express");
const router = express.Router();
const { addTransaction, getTransactions, deleteTransaction, getAnalysis, uploadCSV } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/", addTransaction);
router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);
router.get("/analysis", getAnalysis);
router.post("/upload-csv", uploadCSV);

module.exports = router;