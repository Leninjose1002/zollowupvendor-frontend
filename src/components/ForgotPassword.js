import React, { useState } from "react";
import axiosInstance from "../api/axiosinstance";
import "../styles/auth.css";

const ForgotPassword = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/employees/forgot-password", { email });
      setSuccess(response.data.message);
      setEmail("");
      setTimeout(() => setCurrentPage("login"), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Forgot Password?</h2>
      <p>Enter your email to receive a password reset link.</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage("login");
          }}
          style={{ color: "#007bff", textDecoration: "none" }}
        >
          Back to Login
        </a>
      </p>
    </div>
  );
};

export default ForgotPassword;