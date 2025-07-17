const TimeSlot = require("../models/TimeSlot");

// Generate unique booking ID
const generateBookingId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `BK-${timestamp}-${randomStr}`.toUpperCase();
};

// Initialize default time slots for a given date
const initializeDefaultSlots = async (date) => {
  try {
    // Check if slots already exist for this date
    const existingSlots = await TimeSlot.find({ date });
    if (existingSlots.length > 0) {
      return existingSlots;
    }

    const slots = [];

    // Restaurant hours: 11:00 AM - 9:30 PM with 30-minute intervals
    for (let hour = 11; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip the last slot at 21:30 if you want to close at 9:00 PM
        if (hour === 21 && minute === 30) continue;

        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const dateTime = new Date(`${date}T${time}:00.000Z`);

        slots.push({
          date,
          time,
          dateTime,
          capacity: 4, // Default capacity
        });
      }
    }

    // Insert all slots
    const createdSlots = await TimeSlot.insertMany(slots);
    return createdSlots;
  } catch (error) {
    console.error("Error initializing default slots:", error);
    throw error;
  }
};

module.exports = {
  generateBookingId,
  initializeDefaultSlots,
};
