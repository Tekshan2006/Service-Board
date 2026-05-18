"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getToken, logout } from "../lib/api";
import LoginModal from "../components/LoginModal";

export default function Navbar() {
  const [hasToken, setHasToken] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = getToken();
    setHasToken(!!token);
  }, []);

  function handleLogout() {
    logout();
    setHasToken(false);
  }

  function handleLoginSuccess() {
    setHasToken(true);
  }

  return (
    <>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <nav className="navbar">
        <div className="nav-inner">
          <a href="/" className="nav-brand">Service Board</a>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <a href="/jobs/new" className="btn btn-primary">+ Post a Job</a>
            {hasToken ? (
              <button 
                onClick={handleLogout}
                style={{
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                style={{
                  background: "#27ae60",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
