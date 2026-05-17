const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: ["Plumbing", "Electrical", "Painting", "Joinery", "Other"],
      default: "Other",
    },
    location: {
      type: String,
    },
    contactName: {
      type: String,
    },
    contactEmail: {
      type: String,
      validate: {
        validator: function (v) {
          // basic email check
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("JobRequest", jobRequestSchema);
