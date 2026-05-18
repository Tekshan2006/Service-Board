const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Simple demo login endpoint - generates JWT token
// In production, you would verify username/password against database
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Demo: Accept any email/password for testing purposes
    // In production, verify against database and use bcrypt for passwords
    if (password.length < 3) {
      return res.status(400).json({ message: "Password must be at least 3 characters" });
    }

    // Generate JWT token with user info
    const token = jwt.sign(
      { email, userId: Date.now() },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
