"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllJobs } from "../lib/api";

const CATEGORIES = ["All", "Plumbing", "Electrical", "Painting", "Joinery", "Other"];
const STATUSES = ["All", "Open", "In Progress", "Closed"];

function getBadgeClass(status) {
  if (status === "Open") return "badge badge-open";
  if (status === "In Progress") return "badge badge-inprogress";
  return "badge badge-closed";
}

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [category, status]);

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (category !== "All") filters.category = category;
      if (status !== "All") filters.status = status;
      if (search.trim()) filters.search = search.trim();

      const data = await getAllJobs(filters);
      setJobs(data);
    } catch (err) {
      setError("Could not load jobs. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      fetchJobs();
    }
  }

  return (
    <div>
      <h1 className="page-title">Service Requests</h1>

      {/* filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          style={{ flex: 1, minWidth: "150px" }}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
          ))}
        </select>

        <button className="btn btn-secondary" onClick={fetchJobs}>Search</button>
      </div>

      {/* content */}
      {loading && <p className="loading-text">Loading jobs...</p>}

      {error && <div className="error-box">{error}</div>}

      {!loading && !error && jobs.length === 0 && (
        <div className="empty-state">
          <p>No jobs found.</p>
          <br />
          <Link href="/jobs/new" className="btn btn-primary">Post the first job</Link>
        </div>
      )}

      {!loading && !error && jobs.map((job) => (
        <div key={job._id} className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <Link href={`/jobs/${job._id}`} style={{ textDecoration: "none", color: "#2c3e50" }}>
                <h2 style={{ fontSize: "18px", marginBottom: "4px" }}>{job.title}</h2>
              </Link>
              <p style={{ color: "#555", fontSize: "14px", marginBottom: "8px" }}>
                {job.description.length > 120 ? job.description.slice(0, 120) + "..." : job.description}
              </p>
              <div style={{ fontSize: "13px", color: "#777", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {job.category && <span>📁 {job.category}</span>}
                {job.location && <span>📍 {job.location}</span>}
                <span>🕐 {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <span className={getBadgeClass(job.status)}>{job.status}</span>
            </div>
          </div>
          <div style={{ marginTop: "12px" }}>
            <Link href={`/jobs/${job._id}`} className="btn btn-primary" style={{ fontSize: "13px", padding: "5px 12px" }}>
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
