//imports
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const dotenv = require("dotenv");
const { isAuthenticated } = require("../middleware/jwt.middleware");

dotenv.config();
const router = express.Router();
const saltRounds = 10;

// POST  /auth/signup
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || username === '' || password === '') {
        return res.status(400).json({ message: "Both fields are required" });
    }

    if (password.length < 3) {
        return res.status(400).json({ message: 'Password must be at least 3 characters long' });
    }

    let userFound = false;
    User.findOne({ username })
        .then((foundUser) => {
            if (foundUser) {
                userFound = true;
                throw new Error("User already exists");
            }

            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            return User.create({ username, password: hashedPassword });
        })
        .then((createdUser) => {
            res.status(201).json({ _id: createdUser._id, username: createdUser.username });
        })
        .catch(err => {
            userFound ? res.status(400).json({ message: err.message }) : res.status(500).json({ message: "Internal Server Error" });
        });
});

// POST  /auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || username === '' || password === '') {
        return res.status(400).json({ message: "Both fields are required" });
    }

    let userNotFound = false;
    User.findOne({ username })
        .then((foundUser) => {
            if (!foundUser) {
                userNotFound = true;
                throw new Error("User not found");
            }

            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if (passwordCorrect) {
                const { _id, username } = foundUser;
                const payload = { _id, username };
                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                );
                res.status(200).json({ authToken: authToken });
            } else {
                res.status(401).json({ message: "Unable to authenticate the user" });
            }
        })
        .catch(err => {
            userNotFound ? res.status(401).json({ message: err.message }) : res.status(500).json({ message: "Internal Server Error" });
        });
});

// GET  /auth/verify
router.get('/verify', isAuthenticated, (req, res, next) => {
    res.status(200).json(req.payload);
});

module.exports = router;