// import axiosInstance from "./axiosinstance";

// /**
//  * Get all bookings (Admin/Vendor view)
//  */
// export const fetchAllBookings = async () => {
//   try {
//     const response = await axiosInstance.get("/api/bookings");
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching bookings:", error);
//     throw error;
//   }
// };

// /**
//  * Create a new booking (authenticated)
//  * @param {Object} bookingData - Booking details
//  */
// export const createBooking = async (bookingId, status) => {
//   try {
//     const response = await axiosInstance.patch(
//       `/api/bookings/${bookingId}/status`,
//       { status }
//     );
//     console.log("Booking status updated:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     throw error;
//   }
// };

// /**
//  * Create a nurse booking (Public - no login required)
//  */
// export const createNurseBooking = async (nurseData) => {
//   try {
//     const response = await axiosInstance.post(`${BOOKING_API}/nurse`, nurseData);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error creating nurse booking:", error);
//     throw error;
//   }
// };

// /**
//  * Create a chef booking (Public - no login required)
//  */
// export const createChefBooking = async (chefData) => {
//   try {
//     const response = await axiosInstance.post(`${BOOKING_API}/chef`, chefData);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error creating chef booking:", error);
//     throw error;
//   }
// };

// /**
//  * Create a generic service booking (Public)
//  */
// export const createServiceBooking = async (serviceType, bookingData) => {
//   try {
//     const response = await axiosInstance.post(`${BOOKING_API}/${serviceType}`, bookingData);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error creating ${serviceType} booking:`, error);
//     throw error;
//   }
// };

// /**
//  * Update booking status
//  */
// export const updateBookingStatus = async (bookingId, status) => {
//   try {
    
//     const response = await axiosInstance.patch(`${BOOKING_API}/bookings/${bookingId}/status`, {
//       status,
//     });
//     console.log("✅ Booking status updated:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error updating booking status:", error);
//     throw error;
//   }
// };

// /**
//  * Get nurse bookings (Admin only)
//  */
// export const getNurseBookings = async () => {
//   try {
//     const response = await axiosInstance.get(`${BOOKING_API}/nurse/admin`);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching nurse bookings:", error);
//     throw error;
//   }
// };

// /**
//  * Filter bookings by service type
//  */
// export const filterBookingsByService = async (serviceType) => {
//   try {
//     const allBookings = await fetchAllBookings();
//     return allBookings.filter((b) => b.serviceType === serviceType);
//   } catch (error) {
//     console.error("❌ Error filtering bookings:", error);
//     throw error;
//   }
// };

// /**
//  * Get bookings by status
//  */
// export const getBookingsByStatus = async (status) => {
//   try {
//     const allBookings = await fetchAllBookings();
//     return allBookings.filter((b) => b.status === status);
//   } catch (error) {
//     console.error("❌ Error fetching bookings by status:", error);
//     throw error;
//   }
// };

import axiosInstance from "./axiosinstance";

/**
 * Get all bookings (Admin/Vendor view)
 */
export const fetchAllBookings = async () => {
  try {
    const response = await axiosInstance.get("/api/bookings");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    throw error;
  }
};

/**
 * Create a new booking (authenticated)
 * @param {Object} bookingData - Booking details
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post("/api/bookings", bookingData);
    console.log("✅ Booking created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    throw error;
  }
};

/**
 * Create a nurse booking (Public - no login required)
 */
export const createNurseBooking = async (nurseData) => {
  try {
    const response = await axiosInstance.post("/api/bookings/nurse", nurseData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating nurse booking:", error);
    throw error;
  }
};

/**
 * Create a chef booking (Public - no login required)
 */
export const createChefBooking = async (chefData) => {
  try {
    const response = await axiosInstance.post("/api/bookings/chef", chefData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating chef booking:", error);
    throw error;
  }
};

/**
 * Create a generic service booking (Public)
 */
export const createServiceBooking = async (serviceType, bookingData) => {
  try {
    const response = await axiosInstance.post(
      `/api/bookings/${serviceType}`,
      bookingData
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error creating ${serviceType} booking:`, error);
    throw error;
  }
};

/**
 * Update booking status (MOST IMPORTANT - for Confirm/Cancel)
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axiosInstance.patch(
      `/api/bookings/${bookingId}/status`,
      { status }
    );
    console.log("✅ Booking status updated:", response.data);
    return response.data.booking; 
  } catch (error) {
    console.error("❌ Error updating booking status:", error);
    throw error;
  }
};

/**
 * Get nurse bookings (Admin only)
 */
export const getNurseBookings = async () => {
  try {
    const response = await axiosInstance.get("/api/bookings/nurse/admin");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching nurse bookings:", error);
    throw error;
  }
};

/**
 * Filter bookings by service type
 */
export const filterBookingsByService = async (serviceType) => {
  try {
    const allBookings = await fetchAllBookings();
    return allBookings.filter((b) => b.serviceType === serviceType);
  } catch (error) {
    console.error("❌ Error filtering bookings:", error);
    throw error;
  }
};

/**
 * Get bookings by status
 */
export const getBookingsByStatus = async (status) => {
  try {
    const allBookings = await fetchAllBookings();
    return allBookings.filter((b) => b.status === status);
  } catch (error) {
    console.error("❌ Error fetching bookings by status:", error);
    throw error;
  }
};
