// import
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    try {
        // Get the token string from the authorization header
        const token = req.headers.authorization.split(" ")[1];

        // Verify the token, throws an error if the token is not valid
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        req.payload = payload;
        next();

    } catch (error) {
        res.status(401).json("Token not provided or not valid");
    }
}

// export
module.exports = { isAuthenticated };