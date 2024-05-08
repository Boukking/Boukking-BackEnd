// import
const express = require("express");
const Dwelling = require("../models/Dwelling.model");
const fileUploader = require("../cloudinary/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// instance
const router = express.Router();

// route

// GET /dwelling
router.get('/', (req, res) => {
    res.json({ toto: "toto" });
});

// POST /dwelling
router.post("/", isAuthenticated, (req, res, next) => {
    const {title, type, maxNbPerson, adress, city, zip, country} = req.body;
    if (!title || !type || !maxNbPerson || !adress || !city || !zip || !country) return res.status(400).json({ message: "Fields are missing" });
    if (isNaN(Number(maxNbPerson))) return res.status(400).json({ message: "Max. number of persons need to be a number" });
    if (!["House", "Apartment", "Villa", "Condominium", "Townhouse", "Cottage", "Bungalow", "Duplex", "Penthouse", "Loft", "Mobile Home", "Mansion", "Studio Apartment", "Chalet", "Farmhouse"].includes(type)) return res.status(400).json({ message: "Type is invalid" });
    const author = req.payload._id;
    Dwelling.create({title, type, maxNbPerson, adress, city, zip, country, author})
        .then((createdDwelling) => {
            res.status(201).json({ _id: createdDwelling._id, title: createdDwelling.title });
        })
        .catch(err => {
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// POST /dwelling/img
router.post("/img", fileUploader.single("imageUrl"), isAuthenticated, (req, res, next) => {
    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
    }
    res.json({ fileUrl: req.file.path });
});

// export
module.exports = router;