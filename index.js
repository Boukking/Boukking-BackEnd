//import
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');

// instance
const app = express();

// express middleware
app.use(express.json());
app.use(cors({
    origin: "https://boukking-backend.adaptable.app"
}));

// route
app.use("/auth", require("./routes/auth.routes"));
app.use("/dwelling", require("./routes/dwelling.routes"));
app.use("/user", require("./routes/user.routes"));

// connection
app.listen(process.env.PORT, () => console.log("App listening on port 3000"));

mongoose
    .connect(process.env.DB_URL)
    .then(x => console.log(`Connected to MongoDB, Database name: "${x.connections[0].name}"`))
    .catch(err => console.error("Error connecting to mongoDB", err));