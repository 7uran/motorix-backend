const jwt = require("jsonwebtoken");

const VerifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    try {
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedJwt.user; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};


const VerifyAdminRole = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    const { isAdmin } = req.user;
    if (isAdmin) {
        next();
    } else {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
};

module.exports = { VerifyToken, VerifyAdminRole };
