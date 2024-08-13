const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userPhone: {
    type: Number,
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Booked",
  },
  modifiedAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
