//import
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');

// instance
const app = express();

// express middleware
app.use(express.json());
app.use(cors());

// route
app.use("/auth", require("./routes/auth.routes"));
app.use("/dwelling", require("./routes/dwelling.routes"));

// connection
app.listen(3000, () => console.log("App listening on port 3000"));

mongoose
    .connect("mongodb://127.0.0.1:27017/Boukking")
    .then(x => console.log(`Connected to MongoDB, Database name: "${x.connections[0].name}"`))
    .catch(err => console.error("Error connecting to mongoDB", err));