import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axiosinstance";
import "../styles/auth.css";

const ResetPassword = ({ setCurrentPage }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/employees/reset-password", {
        token,
        email,
        newPassword,
        confirmPassword,
      });
      setSuccess(response.data.message);
      setTimeout(() => setCurrentPage("login"), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ color: "red" }}>Invalid or missing reset link</p>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Reset Password</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
            minLength="6"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;