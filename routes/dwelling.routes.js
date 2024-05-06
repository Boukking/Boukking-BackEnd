// import
const express = require("express");
const Dwelling = require("../models/Dwelling.model");

// instance
const router = express.Router();

// route

// GET /dwelling
router.get('/', (req, res) => {
    res.json({ toto: "toto" });
});

// export
module.exports = router;