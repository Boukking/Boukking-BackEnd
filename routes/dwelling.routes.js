// import
const express = require("express");
const Dwelling = require("../models/Dwelling.model");
const fileUploader = require("../cloudinary/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { isDwellingOwner } = require("../middleware/isDwellingOwner.middleware");

// instance
const router = express.Router();

// route

// GET /dwelling
router.get('/', (req, res) => {
    Dwelling.find()
        .then((dwelling) => {
            res.status(200).json(dwelling);
        })
        .catch(err => {
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// GET /dwelling/:_id
router.get('/:id', (req, res) => {
    const dwellingId = req.params.id;
    Dwelling.findById(dwellingId).populate("author")
        .then((dwelling) => {
            if (dwelling && dwelling.author) {
                const dwellingObj = dwelling.toObject();
                delete dwellingObj.author.password;
                res.status(200).json(dwellingObj);
            } else {
                res.status(404).json({ message: "Dwelling not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// POST /dwelling
router.post("/", isAuthenticated, (req, res) => {
    const { title, description, type, maxPersonNumber, adress, city, zipCode, country } = req.body;

    if (!title || !type || !maxPersonNumber || !adress || !city || !zipCode || !country) return res.status(400).json({ message: "Fields are missing" });
    if (isNaN(Number(maxPersonNumber))) return res.status(400).json({ message: "Max. number of persons need to be a number" });
    if (!["House", "Apartment", "Villa", "Condominium", "Townhouse", "Cottage", "Bungalow", "Duplex", "Penthouse", "Loft", "Mobile Home", "Mansion", "Studio Apartment", "Chalet", "Farmhouse"].includes(type)) return res.status(400).json({ message: "Type is invalid" });
    const author = req.payload._id;
    Dwelling.create({ title, description, type, maxPersonNumber, adress, city, zipCode, country, author })
        .then((createdDwelling) => {
            res.status(201).json({ _id: createdDwelling._id });
        })
        .catch(err => {
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// POST /dwelling/img
router.post("/img", isAuthenticated, fileUploader.single("imageUrl"), (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "Error while uploading the image" });
    res.json({ fileUrl: req.file.path });
});

// PUT /dwelling/:id
router.put("/:id", isAuthenticated, isDwellingOwner, (req, res, next) => {
    const dwellingId = req.params.id;
    const { title, description, type, maxPersonNumber, adress, city, zipCode, country, image } = req.body;

    if (maxPersonNumber && isNaN(Number(maxPersonNumber))) return res.status(400).json({ message: "Max. number of persons need to be a number" });
    if (image && typeof image !== "object") return res.status(400).json({ message: "Images must be in a list" });
    if (type && !["House", "Apartment", "Villa", "Condominium", "Townhouse", "Cottage", "Bungalow", "Duplex", "Penthouse", "Loft", "Mobile Home", "Mansion", "Studio Apartment", "Chalet", "Farmhouse"].includes(type)) return res.status(400).json({ message: "Type is invalid" });

    const modifiedDwelling = {};
    if (title) modifiedDwelling.title = title;
    if (description) modifiedDwelling.description = description;
    if (type) modifiedDwelling.type = type;
    if (maxPersonNumber) modifiedDwelling.maxPersonNumber = maxPersonNumber;
    if (adress) modifiedDwelling.adress = adress;
    if (city) modifiedDwelling.city = city;
    if (zipCode) modifiedDwelling.zipCode = zipCode;
    if (country) modifiedDwelling.country = country;
    if (image) modifiedDwelling.image = image;

    Dwelling.findByIdAndUpdate(dwellingId, modifiedDwelling, { new: true })
        .then((updatedDwelling) => {
            res.status(204).json({ updatedDwelling });
        })
        .catch(() => {
            res.status(500).json({ message: "Failed to update the dwelling" });
        });
});

// export
module.exports = router;