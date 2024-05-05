//imports
const express = require("express");
const Dwelling = require("../models/Dwelling.model");

const router = express.Router();

// GET  /dwelling
router.get('/', (req, res) => {
    res.json({ toto: "toto" });
});

module.exports = router;