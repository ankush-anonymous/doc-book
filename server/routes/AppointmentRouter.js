const express = require("express");
const router = express.Router();

const {
  getAllSlots,
  getAllAppointments,
  getAllTodayAppointments,
  createAppointment,
  deleteAppointment,
  getAppointment,
  updateAppointment,
  clearAppointments,
} = require("../controllers/AppointmentController");
const { update } = require("../models/SlotsSchema");

// Retrieve all slots
router.get("/slots", getAllSlots);

//Clear All appointments
router.delete("/clear", clearAppointments);

// Retrieve all appointments
router.get("/", getAllAppointments);

router.get("/today", getAllTodayAppointments);

// Create a new appointment
router.post("/", createAppointment);

// Delete an appointment by ID
router.delete("/:id", deleteAppointment);

// Get an appointment by ID
router.get("/:id", getAppointment);

router.patch("/:id", updateAppointment);

module.exports = router;
