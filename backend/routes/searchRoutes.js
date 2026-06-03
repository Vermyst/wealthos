const express = require("express");
const router = express.Router();
const { autocomplete } = require("../controllers/searchController");
const { protect } = require("../middleware/authMiddleware");

router.get("/autocomplete", protect, autocomplete);

module.exports = router;