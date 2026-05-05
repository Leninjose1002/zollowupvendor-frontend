import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosinstance";
import "./vendorPortal.css";
import VendorKYCForm from "../components/vendorKYCForm";

const VendorPortal = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
    name: "",
    phone: "",
    sourcing_person_name: "",      // 🆕 NEW
    skill_category: "",             // 🆕 NEW
    diet_type: "",                  // 🆕 NEW
  });
  const [verificationData, setVerificationData] = useState({
    email: "",
    phone: "",
    token: "",
    verificationMethod: "", // "email" or "phone"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [vendorData, setVendorData] = useState(null);
  const [resetPasswordData, setResetPasswordData] = useState({
  newPassword: "",
  confirmPassword: "",
});
  // const [verificationMethod, setVerificationMethod] = useState(null); // "email" or "phone"
  const [otpResendCountdown, setOtpResendCountdown] = useState(0);

  // ✅ Check for email verification token in URL on mount
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get('email');
  const page = params.get('page');

  if (token && email && page === 'reset-password') {
    // Reset password link - go to reset page
    setCurrentPage("reset-password");
  } else if (token && email && page !== 'reset-password') {
    // Email verification link - auto-verify
    setCurrentPage("verify-email-direct");
    handleDirectEmailVerification(email, token);
  }
}, []);

  // ✅ Countdown timer for OTP resend
  useEffect(() => {
    if (otpResendCountdown > 0) {
      const timer = setTimeout(() => setOtpResendCountdown(otpResendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendCountdown]);

  // ✅ Auto-verify email from URL link
  const handleDirectEmailVerification = async (email, token) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/employees/verify-email", {
        email,
        token,
      });

      setSuccess(response.data.message);
      setTimeout(() => {
        setCurrentPage("choose-verification");
        setVerificationData({ email, phone: "", token: "", verificationMethod: "" });
        // setCurrentPage("landing");
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password || !formData.businessName || !formData.phone || !formData.skill_category) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    
    // 🆕 Validate diet_type for Cook/Chef
  if (formData.skill_category === 'Cook/Chef' && !formData.diet_type) {
    setError("Diet type is required for chefs");
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
         sourcing_person_name: formData.sourcing_person_name,  // 🆕 NEW
      skill_category: formData.skill_category,              // 🆕 NEW
      diet_type: formData.diet_type,                        // 🆕 NEW
      });

      setSuccess(response.data.message);
      setVerificationData({ email: formData.email, phone: formData.phone, token: "", verificationMethod: "" });
      setCurrentPage("choose-verification");
      setFormData({ email: "", password: "", businessName: "", name: "", phone: "", sourcing_person_name: "",  // 🆕 Add this
  skill_category: "",         // 🆕 Add this
  diet_type: ""  });
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Choose verification method
  const handleChooseVerificationMethod = async (method) => {
    // setVerificationMethod(method);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (method === "email") {
        // Email verification link is already sent during signup
        setCurrentPage("verify-email");
        setSuccess("Verification link has been sent to your email!");
      } else if (method === "phone") {
        // Send OTP to phone
        const response = await axiosInstance.post("/employees/send-phone-otp", {
          phone: verificationData.phone,
          email: verificationData.email,
        });
        
        setSuccess(response.data.message);
        setCurrentPage("verify-phone");
        setOtpResendCountdown(60); // 60 second countdown
      }
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to send ${method} verification.`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Verify phone OTP
  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!verificationData.phone || !verificationData.token) {
      setError("Phone and OTP are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/employees/verify-phone-otp", {
        phone: verificationData.phone,
        email: verificationData.email,
        otp: verificationData.token,
      });

      setSuccess(response.data.message);
      setTimeout(() => {
        setCurrentPage("landing");
        setVerificationData({ email: "", phone: "", token: "", verificationMethod: "" });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Resend Phone OTP
  const handleResendPhoneOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/employees/send-phone-otp", {
        phone: verificationData.phone,
        email: verificationData.email,
      });

      setSuccess(response.data.message); 
      setOtpResendCountdown(60);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to resend OTP.");
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
      setSuccess("Login successful! Redirecting to dashboard...");
      setFormData({ email: "", password: "", businessName: "", name: "", phone: "", sourcing_person_name: "",  // 🆕 Add this
  skill_category: "",         // 🆕 Add this
  diet_type: ""   });

      setTimeout(() => {
        setCurrentPage("dashboard");
        fetchVendorData(token);
      }, 1500);
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        setError("Please verify your account first");
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
        setVerificationData({ email: "", phone: "", token: "", verificationMethod: "" });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorData = async (authToken) => {
    try {
      const response = await axiosInstance.get("/employees/dashboard", {
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

  // ✅ NEW: Choose verification method page
  const renderChooseVerification = () => (
    <div className="vendor-portal-container">
      <div className="verification-container">
        <h1>Choose Verification Method</h1>
        <p>How would you like to verify your account?</p>

        <div className="verification-options">
          <button
            className="verification-option-card"
            onClick={() => handleChooseVerificationMethod("email")}
            disabled={loading}
          >
            <div className="option-icon">📧</div>
            <h3>Email Verification</h3>
            <p>Receive a verification link on your email</p>
          </button>

          <button
            className="verification-option-card"
            onClick={() => handleChooseVerificationMethod("phone")}
            disabled={loading}
          >
            <div className="option-icon">📱</div>
            <h3>Phone Verification</h3>
            <p>Receive an OTP code on your phone</p>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );

  // ✅ NEW: Phone OTP verification page
  const renderPhoneVerification = () => (
    <div className="vendor-portal-container">
      <div className="verification-container">
        <h1>Verify Your Phone</h1>
        <p>We've sent an OTP to <strong>{verificationData.phone}</strong></p>
        <p>Enter the 6-digit code you received:</p>

        <form onSubmit={handleVerifyPhoneOtp}>
          <div className="form-group">
            <label>OTP Code</label>
            <input
              type="text"
              name="token"
              placeholder="Enter 6-digit OTP"
              value={verificationData.token}
              onChange={handleVerificationChange}
              maxLength="6"
              required
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Verifying..." : "Verify Phone"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <p className="form-footer">
          Didn't receive the code?
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: otpResendCountdown > 0 ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              marginLeft: '4px',
              opacity: otpResendCountdown > 0 ? 0.5 : 1,
            }}
            onClick={handleResendPhoneOtp}
            disabled={otpResendCountdown > 0 || loading}
          >
            {otpResendCountdown > 0 ? `Resend in ${otpResendCountdown}s` : 'Resend OTP'}
          </button>
        </p>

        <p className="form-footer">
          <button
            style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}
            onClick={() => {
              setCurrentPage("choose-verification");
              setVerificationData({ ...verificationData, token: "" });
            }}
          >
            Change verification method
          </button>
        </p>
      </div>
    </div>
  );

  const renderDirectVerification = () => (
    <div className="vendor-portal-container">
      <div className="verification-container">
        <h1>Verifying Your Email...</h1>
        {loading && (
          <>
            <p>Please wait while we verify your email...</p>
            <div className="spinner"></div>
          </>
        )}
        {success && (
          <>
            <div className="success-message">{success}</div>
            <p>Redirecting to login page...</p>
          </>
        )}
        {error && (
          <>
            <div className="error-message">{error}</div>
            <p>
              <button
                style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}
                onClick={() => setCurrentPage("landing")}
              >
                Back to signup
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );

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

            <p className="form-footer">
  <button
    style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}
    onClick={() => setCurrentPage("forgot-password")}
  >
    Forgot password?
  </button>
</p>
          </div>

          <div className="auth-card featured">
            <div className="badge">New vendors</div>
            <h2>Start Earning Today</h2>
            <p className="auth-subtitle">Join our community of successful vendors in just 3 steps.</p>

            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Business Name (Optional)</label>
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

              {/* 🆕 NEW FIELD: Skill Category */}
  <div className="form-group">
    <label>Skill Category *</label>
    <select
      name="skill_category"
      value={formData.skill_category}
      onChange={handleInputChange}
      required
      style={{
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #e1e8ed',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
      }}
    >
      <option value="">Select your skill</option>
      <option value="Labor">Labor</option>
      <option value="Beautician">Beautician</option>
      <option value="Tailor">Tailor</option>
      <option value="Mason">Mason</option>
      <option value="Maid">Maid</option>
      <option value="Cook/Chef">Cook/Chef</option>
      <option value="Plumber">Plumber</option>
      <option value="Electrician">Electrician</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* 🆕 NEW FIELD: Diet Type (Only for Chef) */}
  {formData.skill_category === 'Cook/Chef' && (
    <div className="form-group">
      <label>Diet Specialization *</label>
      <select
        name="diet_type"
        value={formData.diet_type}
        onChange={handleInputChange}
        required
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
        }}
      >
        <option value="">Select diet type</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Non-Vegetarian">Non-Vegetarian</option>
        <option value="Both">Both</option>
      </select>
    </div>
  )}

  {/* 🆕 NEW FIELD: Sourcing Person Name */}
  <div className="form-group">
    <label>Sourcing Person Name </label>
    <input
      type="text"
      name="sourcing_person_name"
      placeholder="Name of the person who referred you"
      value={formData.sourcing_person_name}
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

            <p className="form-footer">
              By signing up, you agree to our
              <button
                style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px'}}
                onClick={() => window.open('/terms', '_blank')}
              >
                Terms of Service
              </button>
            </p>
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
          Didn't receive the email?
          <button
            style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px'}}
            onClick={() => setCurrentPage("choose-verification")}
          >
            Try phone verification instead
          </button>
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
       
       
    <nav className="dashboard-nav">
      <button 
        className="nav-btn" 
        onClick={() => setCurrentPage("dashboard")}
      >
        Dashboard
      </button>
      <button 
        className="nav-btn" 
        onClick={() => setCurrentPage("kyc")}
      >
        KYC Verification
      </button>
    </nav>
   
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
  
  const renderForgotPassword = () => (
  <div className="vendor-portal-container">
    <div className="verification-container">
      <h1>Reset Your Password</h1>
      <p>Enter your email to receive a password reset link.</p>

      <form onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
          const response = await axiosInstance.post("/employees/forgot-password", { 
            email: formData.email 
          });
          setSuccess(response.data.message);
          setFormData({ email: "", password: "", businessName: "", name: "", phone: "", sourcing_person_name: "",  // 🆕 Add this
  skill_category: "",         // 🆕 Add this
  diet_type: ""   });
          setTimeout(() => setCurrentPage("landing"), 3000);
        } catch (err) {
          setError(err.response?.data?.msg || "Failed to send reset link");
        } finally {
          setLoading(false);
        }
      }}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <p className="form-footer">
        <button
          style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}
          onClick={() => setCurrentPage("landing")}
        >
          Back to Login
        </button>
      </p>
    </div>
  </div>
);

const renderResetPassword = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get('email');

  if (!token || !email) {
    return (
      <div className="vendor-portal-container">
        <div className="verification-container">
          <div className="error-message">Invalid or missing reset link</div>
          <p className="form-footer">
            <button
              style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}
              onClick={() => setCurrentPage("landing")}
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-portal-container">
      <div className="verification-container">
        <h1>Reset Password</h1>

        <form onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          setSuccess("");

          if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
          }

          try {
            const response = await axiosInstance.post("/employees/reset-password", {
              token,
              email,
              newPassword: resetPasswordData.newPassword,
              confirmPassword: resetPasswordData.confirmPassword,
            });
            setSuccess(response.data.message);
            setTimeout(() => setCurrentPage("landing"), 2000);
          } catch (err) {
            setError(err.response?.data?.msg || "Failed to reset password");
          } finally {
            setLoading(false);
          }
        }}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={resetPasswordData.newPassword}
onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={resetPasswordData.confirmPassword}
onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
};

const renderKYC = () => {
  console.log('vendorData:', vendorData);
  console.log('vendorId:', vendorData?.vendor?.id);

  return (
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

    <nav className="dashboard-nav">
      <button 
        className="nav-btn" 
        onClick={() => setCurrentPage("dashboard")}
      >
        Dashboard
      </button>
      <button 
        className="nav-btn active" 
        onClick={() => setCurrentPage("kyc")}
      >
        KYC Verification
      </button>
    </nav>

    <div className="dashboard-content">
      <VendorKYCForm 
        vendorId={vendorData?.vendor?.id} 
        onSuccess={() => {
          alert("KYC submitted! Admin will review and approve soon.");
          setCurrentPage("dashboard");
        }}
      />
    </div>
  </div>
  )
      };

  return (
    <div className="vendor-portal">
      {currentPage === "landing" && renderLanding()}
    {currentPage === "choose-verification" && renderChooseVerification()}
    {currentPage === "verify-email" && renderVerification()}
    {currentPage === "verify-phone" && renderPhoneVerification()}
    {currentPage === "verify-email-direct" && renderDirectVerification()}
    {currentPage === "dashboard" && renderDashboard()}
    {currentPage === "forgot-password" && renderForgotPassword()}
    {currentPage === "reset-password" && renderResetPassword()}
     {currentPage === "kyc" && renderKYC()}
    </div>
  );
};

export default VendorPortal;
