const express = require("express");
const router = express.Router();

const { analyzeURL } = require("../controllers/analyzeController");

router.post("/analyze", analyzeURL);

module.exports = router;