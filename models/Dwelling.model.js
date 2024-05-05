const { Schema, model } = require('mongoose');

const dwellingSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    adress: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum: ["romance", "fiction", "biography", "poetry"]
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
    author: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Dwelling = model("Dwelling", dwellingSchema);

module.exports = Dwelling;