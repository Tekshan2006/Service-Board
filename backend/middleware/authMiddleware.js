const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
// Checks if the authorization header contains a valid JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    // Store user info in request object for use in route handlers
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
