const express = require("express");
const router = express.Router();
const JobRequest = require("../models/JobRequest");
const { verifyToken } = require("../middleware/authMiddleware");

// Fetch all jobs with optional filters (category, status, search keyword)
router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    // Filter by category if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Search by keyword in title or description (case-insensitive)
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Get jobs sorted by newest first
    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// Fetch a single job by ID
router.get("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
});

// Create a new job request (requires authentication)
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Create new job document with user info
    const newJob = new JobRequest({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
      createdBy: req.user.email, // Store who created the job
    });

    // Save to MongoDB
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    next(err);
  }
});

// Update job status (Open, In Progress, or Closed) - requires authentication
router.patch("/:id", verifyToken, async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status value
    const allowedStatuses = ["Open", "In Progress", "Closed"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update and return the updated job
    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
});

// Delete a job request (requires authentication)
router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
