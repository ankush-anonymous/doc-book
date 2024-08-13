// models/patient.js
const mongoose = require("mongoose");

const ArrivedPatientsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  slotTime: {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  doctorName: {
    type: String,
    required: true,
  },
  tokenNumber: {
    type: Number, // No longer required
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patient", ArrivedPatientsSchema);

module.exports = Patient;
