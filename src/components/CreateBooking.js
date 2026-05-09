import React, { useState } from "react";
import { createNurseBooking, createChefBooking, createServiceBooking } from "../api/BookingAPI";
import "./CreateBooking.css";

const CreateBooking = ({ onBookingCreated, serviceType = "general" }) => {
  const [activeTab, setActiveTab] = useState(serviceType);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Nurse Booking State
  const [nurseForm, setNurseForm] = useState({
    nurseType: "caregiver",
    shift: "day",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    date: "",
    notes: "",
  });

  // ✅ Chef Booking State
  const [chefForm, setChefForm] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    date: "",
    time: "",
    guests: 4,
    category: "Veg",
    occasion: "Party",
    cuisine: "North Indian",
    utensils: false,
    serviceType: "Cooking Only",
    notes: "",
  });

  // ✅ Generic Service State
  const [serviceForm, setServiceForm] = useState({
    serviceType: "electrician",
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    date: "",
    time: "",
    notes: "",
  });

  // 🏥 Handle Nurse Booking Submit
  const handleNurseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await createNurseBooking(nurseForm);
      console.log("✅ Nurse booking created:", response);
      setSuccess(true);
      setNurseForm({
        nurseType: "caregiver",
        shift: "day",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        date: "",
        notes: "",
      });
      setTimeout(() => setSuccess(false), 3000);
      if (onBookingCreated) onBookingCreated(response.data);
    } catch (err) {
      console.error("❌ Nurse booking failed:", err);
      setError(
        err.response?.data?.message || "Failed to create nurse booking"
      );
    } finally {
      setLoading(false);
    }
  };

  // 👨‍🍳 Handle Chef Booking Submit
  const handleChefSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await createChefBooking(chefForm);
      console.log("✅ Chef booking created:", response);
      setSuccess(true);
      setChefForm({
        name: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        date: "",
        time: "",
        guests: 4,
        category: "Veg",
        occasion: "Party",
        cuisine: "North Indian",
        utensils: false,
        serviceType: "Cooking Only",
        notes: "",
      });
      setTimeout(() => setSuccess(false), 3000);
      if (onBookingCreated) onBookingCreated(response.data);
    } catch (err) {
      console.error("❌ Chef booking failed:", err);
      setError(err.response?.data?.message || "Failed to create chef booking");
    } finally {
      setLoading(false);
    }
  };

  // 🔧 Handle Generic Service Submit
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { serviceType: type, ...rest } = serviceForm;
      const response = await createServiceBooking(type, rest);
      console.log("✅ Service booking created:", response);
      setSuccess(true);
      setServiceForm({
        serviceType: "electrician",
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        date: "",
        time: "",
        notes: "",
      });
      setTimeout(() => setSuccess(false), 3000);
      if (onBookingCreated) onBookingCreated(response.data);
    } catch (err) {
      console.error("❌ Service booking failed:", err);
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-booking-container">
      <div className="form-header">
        <h1>🎯 Create New Booking</h1>
        <p>Fill in the details to create a new service booking</p>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">❌ {error}</div>}
      {success && (
        <div className="alert alert-success">
          ✅ Booking created successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="form-tabs">
        <button
          className={`tab ${activeTab === "nurse" ? "active" : ""}`}
          onClick={() => setActiveTab("nurse")}
        >
          ⚕️ Nurse
        </button>
        <button
          className={`tab ${activeTab === "chef" ? "active" : ""}`}
          onClick={() => setActiveTab("chef")}
        >
          👨‍🍳 Chef
        </button>
        <button
          className={`tab ${activeTab === "service" ? "active" : ""}`}
          onClick={() => setActiveTab("service")}
        >
          🔧 Other Services
        </button>
      </div>

      {/* 🏥 NURSE FORM */}
      {activeTab === "nurse" && (
        <form onSubmit={handleNurseSubmit} className="booking-form">
          <div className="form-section">
            <h2>Nurse Booking Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Nurse Type *</label>
                <select
                  value={nurseForm.nurseType}
                  onChange={(e) =>
                    setNurseForm({ ...nurseForm, nurseType: e.target.value })
                  }
                  required
                >
                  <option value="caregiver">Caregiver</option>
                  <option value="palliative">Palliative Care</option>
                  <option value="post-surgery">Post-Surgery Care</option>
                  <option value="pediatric">Pediatric Nurse</option>
                </select>
              </div>

              <div className="form-group">
                <label>Shift *</label>
                <select
                  value={nurseForm.shift}
                  onChange={(e) =>
                    setNurseForm({ ...nurseForm, shift: e.target.value })
                  }
                  required
                >
                  <option value="day">Day (6 AM - 2 PM)</option>
                  <option value="evening">Evening (2 PM - 10 PM)</option>
                  <option value="night">Night (10 PM - 6 AM)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={nurseForm.email}
                  onChange={(e) =>
                    setNurseForm({ ...nurseForm, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={nurseForm.phone}
                  onChange={(e) =>
                    setNurseForm({ ...nurseForm, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <h3 style={{ marginTop: "1.5rem" }}>Address</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  value={nurseForm.street}
                  onChange={(e) =>
                    setNurseForm({ ...nurseForm, street: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={nurseForm.city}
                  onChange={(e) =>
                    setNurseForm({ ...nurseForm, city: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  value={nurseForm.state}
                  onChange={(e) =>
                    setNurseForm({ ...nurseForm, state: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  value={nurseForm.zip}
                  onChange={(e) =>
                    setNurseForm({ ...nurseForm, zip: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Booking Date *</label>
                <input
                  type="date"
                  value={nurseForm.date}
                  onChange={(e) =>
                    setNurseForm({ ...nurseForm, date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                value={nurseForm.notes}
                onChange={(e) =>
                  setNurseForm({ ...nurseForm, notes: e.target.value })
                }
                placeholder="Any special requirements or notes..."
              ></textarea>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "✅ Create Nurse Booking"}
          </button>
        </form>
      )}

      {/* 👨‍🍳 CHEF FORM */}
      {activeTab === "chef" && (
        <form onSubmit={handleChefSubmit} className="booking-form">
          <div className="form-section">
            <h2>Chef Booking Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={chefForm.name}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={chefForm.phone}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={chefForm.email}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <h3 style={{ marginTop: "1.5rem" }}>Address</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  value={chefForm.street}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, street: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={chefForm.city}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, city: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  value={chefForm.state}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, state: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  value={chefForm.zip}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, zip: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <h3 style={{ marginTop: "1.5rem" }}>Event Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={chefForm.date}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={chefForm.time}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Number of Guests *</label>
                <input
                  type="number"
                  min="1"
                  value={chefForm.guests}
                  onChange={(e) =>
                    setChefForm({
                      ...chefForm,
                      guests: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={chefForm.category}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, category: e.target.value })
                  }
                  required
                >
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Occasion *</label>
                <select
                  value={chefForm.occasion}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, occasion: e.target.value })
                  }
                  required
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Puja">Puja/Religious Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cuisine *</label>
                <select
                  value={chefForm.cuisine}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, cuisine: e.target.value })
                  }
                  required
                >
                  <option value="North Indian">North Indian</option>
                  <option value="South Indian">South Indian</option>
                  <option value="Continental">Continental</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Service Type *</label>
                <select
                  value={chefForm.serviceType}
                  onChange={(e) =>
                    setChefForm({ ...chefForm, serviceType: e.target.value })
                  }
                  required
                >
                  <option value="Cooking Only">Cooking Only</option>
                  <option value="Full Service">Full Service (Cooking + Setup + Cleanup)</option>
                </select>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={chefForm.utensils}
                    onChange={(e) =>
                      setChefForm({ ...chefForm, utensils: e.target.checked })
                    }
                  />
                  Chef will bring utensils
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                value={chefForm.notes}
                onChange={(e) =>
                  setChefForm({ ...chefForm, notes: e.target.value })
                }
                placeholder="Menu preferences, dietary restrictions, etc..."
              ></textarea>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "✅ Create Chef Booking"}
          </button>
        </form>
      )}

      {/* 🔧 GENERIC SERVICE FORM */}
      {activeTab === "service" && (
        <form onSubmit={handleServiceSubmit} className="booking-form">
          <div className="form-section">
            <h2>Service Booking Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Service Type *</label>
                <select
                  value={serviceForm.serviceType}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      serviceType: e.target.value,
                    })
                  }
                  required
                >
                  <option value="electrician">⚡ Electrician</option>
                  <option value="plumber">🔧 Plumber</option>
                  <option value="carpenter">🔨 Carpenter</option>
                  <option value="painter">🎨 Painter</option>
                  <option value="cleaning">🧹 Cleaning Service</option>
                  <option value="gardening">🌿 Gardening</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={serviceForm.email}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={serviceForm.phone}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <h3 style={{ marginTop: "1.5rem" }}>Address</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  value={serviceForm.street}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      street: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={serviceForm.city}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, city: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  value={serviceForm.state}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, state: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  value={serviceForm.zip}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, zip: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preferred Date *</label>
                <input
                  type="date"
                  value={serviceForm.date}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Preferred Time</label>
                <input
                  type="time"
                  value={serviceForm.time}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description of Work Needed *</label>
              <textarea
                value={serviceForm.notes}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, notes: e.target.value })
                }
                placeholder="Describe the service you need in detail..."
                required
              ></textarea>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "✅ Create Service Booking"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateBooking;
