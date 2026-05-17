const express = require("express");
const router = express.Router();
const JobRequest = require("../models/JobRequest");

// GET /api/jobs - get all jobs with optional filters
router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    // bonus: keyword search across title and description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id - get a single job
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

// POST /api/jobs - create a new job
router.post("/", async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    // manual check for required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newJob = new JobRequest({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/jobs/:id - update status only
router.patch("/:id", async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Open", "In Progress", "Closed"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

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

// DELETE /api/jobs/:id - delete a job
router.delete("/:id", async (req, res, next) => {
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
