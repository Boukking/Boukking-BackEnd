//imports
const express = require('express');
const mongoose = require("mongoose");
const { isAuthenticated } = require("./middleware/jwt.middleware");
const cors = require('cors');

//models
const Dwelling = require("./models/Dwelling.model");
const User = require("./models/User.model");

//express instance configuration
const app = express();
app.use(express.json());
app.use(cors());

//routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/dwelling", require("./routes/dwelling.routes"));

//connections
app.listen(3000, () => console.log("App listening on port 3000"));

mongoose
    .connect("mongodb://127.0.0.1:27017/Boukking")
    .then(x => console.log(`Connected to MongoDB, Database name: "${x.connections[0].name}"`))
    .catch(err => console.error("Error connecting to mongoDB", err));