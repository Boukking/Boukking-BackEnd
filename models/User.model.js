const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    dwelling: [
        {
            type: Schema.Types.ObjectId,
            ref: "Dwelling"
        }
    ]
});

const User = model("User", userSchema);

module.exports = User;