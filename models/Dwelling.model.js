// import
const { Schema, model } = require('mongoose');

// model
const dwellingSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    adress: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    zipCode: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum: ["House", "Apartment", "Villa", "Condominium", "Townhouse", "Cottage", "Bungalow", "Duplex", "Penthouse", "Loft", "Mobile Home", "Mansion", "Studio Apartment", "Chalet", "Farmhouse"]
    },
    maxPersonNumber: {
        type: Number,
        min: 1,
        default: 1
    },
    published: {
        type: Date,
        default: Date.now
    },
    rating: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        rate: { type : Number, min: 1, max : 5}
    }],
    image: [String],
    author: {
        type: String,
        required: true
    }
});

const Dwelling = model("Dwelling", dwellingSchema);

// export
module.exports = Dwelling;