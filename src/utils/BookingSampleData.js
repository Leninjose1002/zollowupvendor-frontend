/**
 * 📊 Sample Bookings Data for Testing
 * Static test data with various service types and statuses
 * 
 * Usage:
 * 1. Import in component: import { getSampleBookingsData } from './BookingSampleData'
 * 2. Use: const bookings = getSampleBookingsData()
 */

/**
 * 📋 Get all sample bookings
 */
export const getSampleBookingsData = () => {
  return [
    // 🎨 PAINTER
    {
      _id: "booking_001",
      name: "Jose Lenin",
      email: "jose@example.com",
      phone: "+91-9876543210",
      serviceType: "painter",
      status: "pending",
      address: "123 Main Street, Delhi",
      notes: "Full apartment painting - 2 bedrooms, 1 kitchen",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },

    // 🧼 FOAM JET SERVICE
    {
      _id: "booking_002",
      name: "Unknown Customer",
      email: "customer@example.com",
      phone: "+91-8765432109",
      serviceType: "foamjet",
      status: "confirmed",
      address: "456 Park Avenue, Delhi",
      notes: "Car foam jet cleaning",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },

    // 🚗 DRIVER
    {
      _id: "booking_003",
      name: "Gurpreet Singh",
      email: "gurpreet.driver@example.com",
      phone: "+91-7654321098",
      serviceType: "driver",
      status: "pending",
      address: "789 Transport Road, Delhi",
      notes: "Personal driver needed for daily commute - 8 hours/day",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },

    // 🔨 CARPENTER
    {
      _id: "booking_004",
      name: "Gurpreet Singh",
      email: "gurpreet.carpenter@example.com",
      phone: "+91-6543210987",
      serviceType: "carpenter",
      status: "pending",
      address: "321 Wood Lane, Delhi",
      notes: "Custom cabinet making for kitchen - 5 days project",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },

    // 🔧 CARPENTER (Another Project)
    {
      _id: "booking_005",
      name: "Jai Ram",
      email: "jairam@example.com",
      phone: "+91-5432109876",
      serviceType: "carpenter",
      status: "pending",
      address: "654 Repair Street, Delhi",
      notes: "Door and window repair",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },

    // ⚡ ELECTRICIAN
    {
      _id: "booking_006",
      name: "Rajesh Kumar",
      email: "rajesh.elec@example.com",
      phone: "+91-4321098765",
      serviceType: "electrician",
      status: "confirmed",
      address: "987 Light Avenue, Delhi",
      notes: "Complete wiring for new office setup",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },

    // 🔧 PLUMBER
    {
      _id: "booking_007",
      name: "Amit Sharma",
      email: "amit.plumb@example.com",
      phone: "+91-3210987654",
      serviceType: "plumber",
      status: "pending",
      address: "135 Water Lane, Delhi",
      notes: "Bathroom pipe repair and installation",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },

    // 🧹 MAID
    {
      _id: "booking_008",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91-2109876543",
      serviceType: "maid",
      status: "confirmed",
      address: "246 Clean Street, Delhi",
      notes: "Daily home cleaning - 3 hours per day",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },

    // ⚕️ NURSE
    {
      _id: "booking_009",
      name: "Mrs. Sharma",
      email: "sharma.family@example.com",
      phone: "+91-1098765432",
      serviceType: "nurse",
      status: "pending",
      nurseType: "Post-Surgery Care",
      shift: "evening",
      address: "369 Hospital Road, Delhi",
      notes: "Post-surgery wound dressing and care - Evening shift 6PM to 10PM",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },

    // 👨‍🍳 CHEF
    {
      _id: "booking_010",
      name: "Vikram Patel",
      email: "vikram.party@example.com",
      phone: "+91-9087654321",
      serviceType: "chef",
      status: "pending",
      noOfGuests: 25,
      cuisine: "North Indian",
      occasion: "Birthday Party",
      bringUtensils: true,
      address: "789 Celebration Road, Delhi",
      notes: "Birthday party catering for 25 guests - North Indian cuisine",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },

    // 👨‍🍳 CHEF (Anniversary)
    {
      _id: "booking_011",
      name: "Anita Singh",
      email: "anita.anni@example.com",
      phone: "+91-8076543210",
      serviceType: "chef",
      status: "confirmed",
      noOfGuests: 15,
      cuisine: "Continental",
      occasion: "Anniversary Dinner",
      bringUtensils: false,
      address: "456 Romance Lane, Delhi",
      notes: "Anniversary dinner for 15 people - Continental cuisine",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },

    // 👨‍🍳 CHEF (Corporate)
    {
      _id: "booking_012",
      name: "Mr. Verma",
      email: "verma.corporate@example.com",
      phone: "+91-7076543210",
      serviceType: "chef",
      status: "cancelled",
      noOfGuests: 50,
      cuisine: "South Indian",
      occasion: "Corporate Lunch",
      bringUtensils: true,
      address: "789 Business Park, Delhi",
      notes: "Corporate lunch event - 50 guests - South Indian cuisine",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];
};

/**
 * 🎯 Generate and log sample bookings
 */
export const generateSampleBookings = () => {
  const data = getSampleBookingsData();
  console.log("📊 Sample Bookings:", data);
  console.log(`📈 Total: ${data.length} | ⏳ Pending: ${data.filter(b => b.status === "pending").length} | ✅ Confirmed: ${data.filter(b => b.status === "confirmed").length} | ❌ Cancelled: ${data.filter(b => b.status === "cancelled").length}`);
  return data;
};

// 🚀 Default export
export default getSampleBookingsData;
