// Global error handler - catches all errors passed to next(err)
// Handles different error types and sends appropriate responses
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Handle invalid MongoDB ObjectId format
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Default server error response
  res.status(500).json({ message: "Something went wrong on the server" });
};

module.exports = errorHandler;
