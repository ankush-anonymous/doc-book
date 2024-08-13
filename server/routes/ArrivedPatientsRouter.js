// routes/patientRouter.js
const express = require("express");
const router = express.Router();
const patientController = require("../controllers/ArrivedPatientController");

// Create a new patient
router.post("/", patientController.createPatient);

// Define other routes for CRUD operations as needed
router.get("/appointments", patientController.getAllAppointments);

module.exports = router;
