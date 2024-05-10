// import
const Dwelling = require("../models/Dwelling.model");

const isDwellingOwner = (req, res, next) => {
    const dwellingId = req.params.id;
    Dwelling.findById(dwellingId)
        .then((dwelling) => {
            if (!dwelling) return res.status(404).json({ message: "Dwelling not found" });
            if (dwelling.author.toString() === req.payload._id) {
                next();
            } else {
                return res.status(401).json({ message: "You are not the owner of this dwelling" });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        });
};

// export
module.exports = { isDwellingOwner };