// global error handler - catches anything passed to next(err)
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // default server error
  res.status(500).json({ message: "Something went wrong on the server" });
};

module.exports = errorHandler;
