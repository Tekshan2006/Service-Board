const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

// Mock app for testing
const app = express();
app.use(express.json());

// Mock middleware
const mockAuthMiddleware = (req, res, next) => {
  req.user = { email: "test@example.com", userId: 123 };
  next();
};

// Test routes
app.get("/api/jobs", (req, res) => {
  res.json([
    { _id: "1", title: "Test Job", category: "Plumbing", status: "Open" },
    { _id: "2", title: "Test Job 2", category: "Electrical", status: "In Progress" },
  ]);
});

app.get("/api/jobs/:id", (req, res) => {
  if (req.params.id === "1") {
    res.json({ _id: "1", title: "Test Job", category: "Plumbing", status: "Open" });
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

app.post("/api/jobs", mockAuthMiddleware, (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }
  res.status(201).json({
    _id: "3",
    title,
    description,
    category: req.body.category || "Other",
    status: "Open",
    createdBy: req.user.email,
  });
});

app.patch("/api/jobs/:id", mockAuthMiddleware, (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["Open", "In Progress", "Closed"];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  if (req.params.id === "1") {
    res.json({ _id: "1", title: "Test Job", status });
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

app.delete("/api/jobs/:id", mockAuthMiddleware, (req, res) => {
  if (req.params.id === "1") {
    res.json({ message: "Job deleted successfully" });
  } else {
    res.status(404).json({ message: "Job not found" });
  }
});

// Test POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (password.length < 3) {
    return res.status(400).json({ message: "Password must be at least 3 characters" });
  }
  const token = jwt.sign({ email, userId: Date.now() }, "your-secret-key", {
    expiresIn: "24h",
  });
  res.json({ message: "Login successful", token, user: { email } });
});

// TESTS

describe("GET /api/jobs", () => {
  it("should return all jobs", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe("Test Job");
  });

  it("should have correct job structure", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.body[0]).toHaveProperty("_id");
    expect(res.body[0]).toHaveProperty("title");
    expect(res.body[0]).toHaveProperty("category");
    expect(res.body[0]).toHaveProperty("status");
  });
});

describe("GET /api/jobs/:id", () => {
  it("should return a single job by ID", async () => {
    const res = await request(app).get("/api/jobs/1");
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe("1");
    expect(res.body.title).toBe("Test Job");
  });

  it("should return 404 for non-existent job", async () => {
    const res = await request(app).get("/api/jobs/999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Job not found");
  });
});

describe("POST /api/jobs (Create Job)", () => {
  it("should create a new job with valid data", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({
        title: "New Job",
        description: "This is a new job",
        category: "Plumbing",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("New Job");
    expect(res.body.status).toBe("Open");
    expect(res.body.createdBy).toBe("test@example.com");
  });

  it("should return 400 if title is missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({ description: "Missing title" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Title and description are required");
  });

  it("should return 400 if description is missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({ title: "Missing description" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Title and description are required");
  });
});

describe("PATCH /api/jobs/:id (Update Status)", () => {
  it("should update job status successfully", async () => {
    const res = await request(app)
      .patch("/api/jobs/1")
      .send({ status: "In Progress" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("In Progress");
  });

  it("should return 400 for invalid status", async () => {
    const res = await request(app)
      .patch("/api/jobs/1")
      .send({ status: "Invalid Status" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid status value");
  });

  it("should return 404 for non-existent job", async () => {
    const res = await request(app)
      .patch("/api/jobs/999")
      .send({ status: "Closed" });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /api/jobs/:id", () => {
  it("should delete a job successfully", async () => {
    const res = await request(app).delete("/api/jobs/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Job deleted successfully");
  });

  it("should return 404 when deleting non-existent job", async () => {
    const res = await request(app).delete("/api/jobs/999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Job not found");
  });
});

describe("POST /api/auth/login", () => {
  it("should login successfully and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("should return 400 if email is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "password123" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email and password are required");
  });

  it("should return 400 if password is too short", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "ab" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Password must be at least 3 characters");
  });
});
