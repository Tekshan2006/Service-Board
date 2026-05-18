// Backend API URL from environment or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

// Helper function to get JWT token from localStorage
function getAuthToken() {
  if (typeof window === "undefined") return null; // SSR safety
  return localStorage.getItem("jwt_token");
}

// Helper function to create headers with JWT token if available
function getHeaders(includeAuth = false) {
  const headers = { "Content-Type": "application/json" };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

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
    headers: getHeaders(true), // Include JWT token
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
    headers: getHeaders(true), // Include JWT token
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
    headers: getHeaders(true), // Include JWT token
  });

  if (!res.ok) {
    throw new Error("Failed to delete job");
  }

  return res.json();
}

// Login and get JWT token
export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Login failed");
  }

  // Store token in localStorage
  if (typeof window !== "undefined" && json.token) {
    localStorage.setItem("jwt_token", json.token);
  }

  return json;
}

// Logout and remove JWT token
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt_token");
  }
}

// Get current stored token
export function getToken() {
  return getAuthToken();
}

