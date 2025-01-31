const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, "ali18", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    req.user = decoded;
    next(); 
  });
};

module.exports = authMiddleware;