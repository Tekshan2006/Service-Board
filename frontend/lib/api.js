// Backend API URL from environment or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

// Fetch all jobs with optional filters (category, status, search)
export async function getAllJobs(filters = {}) {
  const params = new URLSearchParams();

  // Build query parameters from filters
  if (filters.category) params.append("category", filters.category);
  if (filters.status) params.append("status", filters.status);
  if (filters.search) params.append("search", filters.search);

  const res = await fetch(`${API_URL}/api/jobs?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

// Fetch a single job by ID
export async function getJobById(id) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Job not found");
  }

  return res.json();
}

// Create a new job request
export async function createJob(data) {
  const res = await fetch(`${API_URL}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to create job");
  }

  return json;
}

// Update a job's status (Open, In Progress, or Closed)
export async function updateJobStatus(id, status) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to update status");
  }

  return json;
}

// Delete a job request
export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete job");
  }

  return res.json();
}
