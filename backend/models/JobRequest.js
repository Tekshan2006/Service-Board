const mongoose = require("mongoose");

// Define the schema for job requests in the database
const jobRequestSchema = new mongoose.Schema(
  {
    // Service title (e.g., "Leaky tap repair needed")
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    // Details about the service needed
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    // Category of service (Plumbing, Electrical, etc.)
    category: {
      type: String,
      enum: ["Plumbing", "Electrical", "Painting", "Joinery", "Other"],
      default: "Other",
    },
    // Where the service is needed
    location: {
      type: String,
    },
    // Person requesting the service
    contactName: {
      type: String,
    },
    // Email to contact the requester
    contactEmail: {
      type: String,
      validate: {
        validator: function (v) {
          // Simple email validation
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    // Current status of the service request
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model("JobRequest", jobRequestSchema);
