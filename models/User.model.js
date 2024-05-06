// import
const { Schema, model } = require('mongoose');

// model
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

// export
module.exports = User;