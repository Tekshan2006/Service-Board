"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getJobById, updateJobStatus, deleteJob } from "../../../lib/api";

const STATUSES = ["Open", "In Progress", "Closed"];

function getBadgeClass(status) {
  if (status === "Open") return "badge badge-open";
  if (status === "In Progress") return "badge badge-inprogress";
  return "badge badge-closed";
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await getJobById(id);
        setJob(data);
        setSelectedStatus(data.status);
      } catch (err) {
        setError("Job not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id]);

  async function handleStatusChange() {
    if (selectedStatus === job.status) {
      setUpdateMsg("Status is already set to that value.");
      return;
    }

    setUpdating(true);
    setUpdateMsg("");
    try {
      const updated = await updateJobStatus(id, selectedStatus);
      setJob(updated);
      setUpdateMsg("Status updated successfully!");
    } catch (err) {
      setUpdateMsg("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteJob(id);
      router.push("/");
    } catch (err) {
      setDeleting(false);
      alert("Failed to delete the job.");
    }
  }

  if (loading) return <p className="loading-text">Loading job...</p>;
  if (error) return (
    <div>
      <Link href="/" className="back-link">← Back to jobs</Link>
      <div className="error-box">{error}</div>
    </div>
  );

  return (
    <div>
      <Link href="/" className="back-link">← Back to jobs</Link>

      <div className="card">
        {/* title and status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          <h1 style={{ fontSize: "22px", color: "#2c3e50" }}>{job.title}</h1>
          <span className={getBadgeClass(job.status)}>{job.status}</span>
        </div>

        {/* description */}
        <p style={{ marginBottom: "20px", color: "#444", lineHeight: "1.6" }}>{job.description}</p>

        {/* details grid */}
        <div className="detail-grid">
          <div className="detail-item">
            <label>Category</label>
            <p>{job.category || "Not specified"}</p>
          </div>
          <div className="detail-item">
            <label>Location</label>
            <p>{job.location || "Not specified"}</p>
          </div>
          <div className="detail-item">
            <label>Contact Name</label>
            <p>{job.contactName || "Not provided"}</p>
          </div>
          <div className="detail-item">
            <label>Contact Email</label>
            <p>{job.contactEmail || "Not provided"}</p>
          </div>
          <div className="detail-item">
            <label>Posted On</label>
            <p>{new Date(job.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

        {/* change status */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "10px", fontSize: "16px" }}>Update Status</h3>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: "7px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              onClick={handleStatusChange}
              disabled={updating}
            >
              {updating ? "Saving..." : "Save Status"}
            </button>
          </div>
          {updateMsg && (
            <p style={{ marginTop: "8px", fontSize: "14px", color: updateMsg.includes("success") ? "#27ae60" : "#e74c3c" }}>
              {updateMsg}
            </p>
          )}
        </div>

        {/* delete */}
        <div>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
