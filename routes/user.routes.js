// import
const express = require("express");
const User = require("../models/User.model");

// instance
const router = express.Router();

// route

// GET /user/:_id
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId)
        .then((user) => {
            if (user) {
                res.status(200).json({username : user.username});
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// export
module.exports = router;