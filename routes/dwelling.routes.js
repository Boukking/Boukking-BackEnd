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
    res.json({ toto: "toto" });
});

// GET /dwelling/:_id
router.get('/:id', (req, res) => {
    const dwellingId = req.params.id;
    Dwelling.find({_id: dwellingId})
        .then((dwelling) => {
            res.status(201).json(dwelling);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// POST /dwelling
router.post("/", isAuthenticated, (req, res) => {
    const { title, type, maxPersonNumber, adress, city, zip, country } = req.body;
    
    if (!title || !type || !maxPersonNumber || !adress || !city || !zip || !country) return res.status(400).json({ message: "Fields are missing" });
    if (isNaN(Number(maxPersonNumber))) return res.status(400).json({ message: "Max. number of persons need to be a number" });
    if (!["House", "Apartment", "Villa", "Condominium", "Townhouse", "Cottage", "Bungalow", "Duplex", "Penthouse", "Loft", "Mobile Home", "Mansion", "Studio Apartment", "Chalet", "Farmhouse"].includes(type)) return res.status(400).json({ message: "Type is invalid" });
    const author = req.payload._id;
    Dwelling.create({ title, type, maxPersonNumber, adress, city, zip, country, author })
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
    const { title, type, maxPersonNumber, adress, city, zip, country, image } = req.body;

    if (maxPersonNumber && isNaN(Number(maxPersonNumber))) return res.status(400).json({ message: "Max. number of persons need to be a number" });
    if (image && typeof image !== "object") return res.status(400).json({ message: "Images must be in a list" });
    if (type && !["House", "Apartment", "Villa", "Condominium", "Townhouse", "Cottage", "Bungalow", "Duplex", "Penthouse", "Loft", "Mobile Home", "Mansion", "Studio Apartment", "Chalet", "Farmhouse"].includes(type)) return res.status(400).json({ message: "Type is invalid" });
    
    const modifiedDwelling = {};
    if (title) modifiedDwelling.title = title;
    if (type) modifiedDwelling.type = type;
    if (maxPersonNumber) modifiedDwelling.maxPersonNumber = maxPersonNumber;
    if (adress) modifiedDwelling.adress = adress;
    if (city) modifiedDwelling.city = city;
    if (zip) modifiedDwelling.zip = zip;
    if (country) modifiedDwelling.country = country;
    if (zip) modifiedDwelling.zip = zip;
    if (image) modifiedDwelling.image = image;

    Dwelling.findByIdAndUpdate(dwellingId, modifiedDwelling, { new: true })
        .then((updatedDwelling) => {
            res.status(204).json({updatedDwelling});
        })
        .catch(() => {
            res.status(500).json({ message: "Failed to update the dwelling" });
        });
});

// export
module.exports = router;