import React, { useEffect, useState } from "react";
import { fetchAllBookings, updateBookingStatus } from "../api/BookingAPI";
import "./BookingDashboard.css";
import { getSampleBookingsData } from "../utils/BookingSampleData";

const BookingsDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);

  // 📥 Fetch bookings on component mount
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);

      // Use sample data in development, real API in production
    let data;
    if (process.env.NODE_ENV === "development") {
      data = getSampleBookingsData(); // 🧪 Test data
    } else {
      data = await fetchAllBookings(); // 🚀 Production API
    }
      // const data = await fetchAllBookings();
      setBookings(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Handle status update
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const updated = await updateBookingStatus(bookingId, newStatus);
      setBookings(
        bookings.map((b) => (b._id === bookingId ? updated : b))
      );
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert("Failed to update booking status");
    }
  };

  // 🔍 Filter bookings
  const filteredBookings =
    selectedStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === selectedStatus);

  // 📊 Count by status
  const statusCounts = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  // 🎨 Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500"; // Orange
      case "confirmed":
        return "#4CAF50"; // Green
      case "cancelled":
        return "#F44336"; // Red
      default:
        return "#999";
    }
  };

  // 🎨 Service type icon
  const getServiceIcon = (serviceType) => {
    const icons = {
      maid: "🧹",
      nurse: "⚕️",
      chef: "👨‍🍳",
      electrician: "⚡",
      plumber: "🔧",
      default: "📌",
    };
    return icons[serviceType] || icons.default;
  };

  if (loading) {
    return (
      <div className="bookings-container loading">
        <div className="loader"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>📅 Bookings Dashboard</h1>
        <p className="subtitle">Manage all your service bookings</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* 📊 Status Stats */}
      <div className="status-stats">
        <div
          className={`stat-card ${selectedStatus === "all" ? "active" : ""}`}
          onClick={() => setSelectedStatus("all")}
        >
          <h3>Total</h3>
          <p className="stat-number">{bookings.length}</p>
        </div>
        <div
          className={`stat-card pending ${selectedStatus === "pending" ? "active" : ""}`}
          onClick={() => setSelectedStatus("pending")}
        >
          <h3>Pending</h3>
          <p className="stat-number">{statusCounts.pending}</p>
        </div>
        <div
          className={`stat-card confirmed ${selectedStatus === "confirmed" ? "active" : ""}`}
          onClick={() => setSelectedStatus("confirmed")}
        >
          <h3>Confirmed</h3>
          <p className="stat-number">{statusCounts.confirmed}</p>
        </div>
        <div
          className={`stat-card cancelled ${selectedStatus === "cancelled" ? "active" : ""}`}
          onClick={() => setSelectedStatus("cancelled")}
        >
          <h3>Cancelled</h3>
          <p className="stat-number">{statusCounts.cancelled}</p>
        </div>
      </div>

      {/* 📋 Bookings List */}
      <div className="bookings-list">
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📭</p>
            <p>No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className={`booking-card status-${booking.status}`}
            >
              {/* Booking Header */}
              <div
                className="booking-header"
                onClick={() =>
                  setExpandedBooking(
                    expandedBooking === booking._id ? null : booking._id
                  )
                }
              >
                <div className="booking-title">
                  <span className="service-icon">
                    {getServiceIcon(booking.serviceType)}
                  </span>
                  <div>
                    <h3>
                      {booking.name || booking.email || "Unknown Customer"}
                    </h3>
                    <p className="service-name">
                      {booking.serviceType.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="booking-meta">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                  <span className="expand-icon">
                    {expandedBooking === booking._id ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedBooking === booking._id && (
                <div className="booking-details">
                  <div className="details-grid">
                    {/* Name */}
                    {booking.name && (
                      <div className="detail-item">
                        <label>Name</label>
                        <p>{booking.name}</p>
                      </div>
                    )}

                    {/* Email */}
                    {booking.email && (
                      <div className="detail-item">
                        <label>Email</label>
                        <p>
                          <a href={`mailto:${booking.email}`}>
                            {booking.email}
                          </a>
                        </p>
                      </div>
                    )}

                    {/* Phone */}
                    {booking.phone && (
                      <div className="detail-item">
                        <label>Phone</label>
                        <p>
                          <a href={`tel:${booking.phone}`}>{booking.phone}</a>
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    {booking.date && (
                      <div className="detail-item">
                        <label>Booking Date</label>
                        <p>{new Date(booking.date).toLocaleString()}</p>
                      </div>
                    )}

                    {/* Address */}
                    {booking.address && (
                      <div className="detail-item full-width">
                        <label>Address</label>
                        <p>{booking.address}</p>
                      </div>
                    )}

                    {/* Service-Specific Fields */}
                    {booking.serviceType === "nurse" && (
                      <>
                        {booking.nurseType && (
                          <div className="detail-item">
                            <label>Nurse Type</label>
                            <p>{booking.nurseType}</p>
                          </div>
                        )}
                        {booking.shift && (
                          <div className="detail-item">
                            <label>Shift</label>
                            <p>{booking.shift}</p>
                          </div>
                        )}
                      </>
                    )}

                    {booking.serviceType === "chef" && (
                      <>
                        {booking.noOfGuests && (
                          <div className="detail-item">
                            <label>Guests</label>
                            <p>{booking.noOfGuests}</p>
                          </div>
                        )}
                        {booking.cuisine && (
                          <div className="detail-item">
                            <label>Cuisine</label>
                            <p>{booking.cuisine}</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Notes */}
                    {booking.notes && (
                      <div className="detail-item full-width">
                        <label>Notes</label>
                        <p>{booking.notes}</p>
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="detail-item">
                      <label>Created</label>
                      <p>{new Date(booking.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="booking-actions">
                    {booking.status === "pending" && (
                      <>
                        <button
                          className="btn btn-confirm"
                          onClick={() =>
                            handleStatusChange(booking._id, "confirmed")
                          }
                        >
                          ✅ Confirm
                        </button>
                        <button
                          className="btn btn-cancel"
                          onClick={() =>
                            handleStatusChange(booking._id, "cancelled")
                          }
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        className="btn btn-cancel"
                        onClick={() =>
                          handleStatusChange(booking._id, "cancelled")
                        }
                      >
                        ❌ Cancel Booking
                      </button>
                    )}

                    {booking.status === "cancelled" && (
                      <p className="cancelled-note">
                        This booking has been cancelled
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsDashboard;
