import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosinstance";
import "./vendorPortal.css";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const VendorPortal = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
    name: "",
    phone: "",
  });
  const [verificationData, setVerificationData] = useState({
    email: "",
    token: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [vendorData, setVendorData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("vendorToken"));

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password || !formData.businessName || !formData.phone) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/employees/register", {
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName,
        name: formData.name || formData.businessName,
        phone: formData.phone,
      });

      setSuccess(response.data.message);
      setVerificationData({ email: formData.email, token: "" });
      setCurrentPage("verify");
      setFormData({ email: "", password: "", businessName: "", name: "", phone: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/employees/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token } = response.data;
      localStorage.setItem("vendorToken", token);
      setToken(token);
      setSuccess("Login successful! Redirecting to dashboard...");
      setFormData({ email: "", password: "", businessName: "", name: "", phone: "" });

      setTimeout(() => {
        setCurrentPage("dashboard");
        fetchVendorData(token);
      }, 1500);
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        setError("Please verify your email first");
      } else {
        setError(err.response?.data?.msg || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!verificationData.email || !verificationData.token) {
      setError("Email and verification token are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/employees/verify-email", {
        email: verificationData.email,
        token: verificationData.token,
      });

      setSuccess(response.data.message);
      setTimeout(() => {
        setCurrentPage("landing");
        setVerificationData({ email: "", token: "" });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorData = async (authToken) => {
    try {
      const response = await axiosInstance.get("/vendor/dashboard", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setVendorData(response.data);
    } catch (err) {
      console.error("Error fetching vendor data:", err);
      setError("Failed to load dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    setToken(null);
    setVendorData(null);
    setCurrentPage("landing");
    setSuccess("Logged out successfully");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerificationChange = (e) => {
    const { name, value } = e.target;
    setVerificationData((prev) => ({ ...prev, [name]: value }));
  };

  const renderLanding = () => (
    <div className="vendor-portal-container">
      <header className="vendor-header">
        <div className="vendor-logo">Zollowup Vendor Portal</div>
        <nav className="vendor-nav">
          <button className="nav-btn" onClick={() => setCurrentPage("login")}>Help</button>
        </nav>
      </header>

      <section className="vendor-hero">
        <div className="hero-content">
          <h1>Grow Your Business With Zollowup</h1>
          <p>Join thousands of vendors earning more every day. Manage your services, track earnings, and reach more customers on our platform.</p>
        </div>

        <div className="auth-container">
          <div className="auth-card">
            <h2>Vendor Login</h2>
            <p className="auth-subtitle">Existing vendors sign in to access your dashboard.</p>
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="divider">Or continue with</div>
            <button className="btn btn-secondary" disabled={loading}>Google</button>
            <button className="btn btn-secondary" disabled={loading}>Phone</button>

            <p className="form-footer"><a href="#">Forgot password?</a></p>
          </div>

          <div className="auth-card featured">
            <div className="badge">New vendors</div>
            <h2>Start Earning Today</h2>
            <p className="auth-subtitle">Join our community of successful vendors in just 3 steps.</p>

            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Your business name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <p className="form-footer">By signing up, you agree to our <a href="#">Terms of Service</a></p>
          </div>
        </div>
      </section>

      <section className="vendor-features">
        <h2>Why Vendors Choose Zollowup</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Analytics</h3>
            <p>Track earnings, bookings, and customer ratings all in one dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Instant Payouts</h3>
            <p>Get paid daily or weekly. Choose your preferred payment method.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Vendor Protection</h3>
            <p>Professional insurance and dispute resolution support included.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile App</h3>
            <p>Manage everything on the go with our vendor mobile app.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Growing Community</h3>
            <p>Connect with other vendors and grow together.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Training & Support</h3>
            <p>Free training to help you succeed and scale your business.</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderVerification = () => (
    <div className="vendor-portal-container">
      <div className="verification-container">
        <h1>Verify Your Email</h1>
        <p>We've sent a verification link to <strong>{verificationData.email}</strong></p>
        <p>Enter the verification code from your email:</p>

        <form onSubmit={handleVerifyEmail}>
          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              name="token"
              placeholder="Paste the verification token"
              value={verificationData.token}
              onChange={handleVerificationChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <p className="form-footer">
          Didn't receive the email? <a href="#" onClick={() => setCurrentPage("landing")}>Back to signup</a>
        </p>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="vendor-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-logo">Zollowup Vendor Dashboard</div>
        <div className="vendor-profile">
          {vendorData && (
            <>
              <span>{vendorData.vendor.businessName}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </header>

      {vendorData && (
        <div className="dashboard-content">
          <section className="dashboard-stats">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Earnings</div>
                <div className="stat-value">₹{vendorData.stats.totalEarnings.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Available Balance</div>
                <div className="stat-value">₹{vendorData.stats.availableBalance.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Bookings</div>
                <div className="stat-value">{vendorData.stats.totalBookings}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Rating</div>
                <div className="stat-value">⭐ {vendorData.stats.averageRating.toFixed(1)}</div>
              </div>
            </div>
          </section>

          <section className="dashboard-payments">
            <h2>Payment Methods</h2>
            <div className="payment-methods">
              <div className="payment-method">
                <h3>💳 Razorpay</h3>
                <p>{vendorData.paymentMethods.hasRazorpay ? "✅ Configured" : "Not configured"}</p>
                <button className="btn btn-secondary">
                  {vendorData.paymentMethods.hasRazorpay ? "Manage" : "Setup"}
                </button>
              </div>
              <div className="payment-method">
                <h3>🏦 Bank Account</h3>
                <p>{vendorData.paymentMethods.hasBankDetails ? "✅ Configured" : "Not configured"}</p>
                <button className="btn btn-secondary">
                  {vendorData.paymentMethods.hasBankDetails ? "Update" : "Add"}
                </button>
              </div>
              <div className="payment-method">
                <h3>💰 UPI</h3>
                <p>{vendorData.paymentMethods.hasUpi ? "✅ Configured" : "Not configured"}</p>
                <button className="btn btn-secondary">
                  {vendorData.paymentMethods.hasUpi ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );

  return (
    <div className="vendor-portal">
      {currentPage === "landing" && renderLanding()}
      {currentPage === "verify" && renderVerification()}
      {currentPage === "dashboard" && renderDashboard()}
    </div>
  );
};

export default VendorPortal;