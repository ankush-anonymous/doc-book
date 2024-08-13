// controllers/patientController.js
const Patient = require("../models/ArrivedPatientsSchema");

// Helper function to check if it's a different day
const isDifferentDay = (date1, date2) => {
  return (
    date1.getFullYear() !== date2.getFullYear() ||
    date1.getMonth() !== date2.getMonth() ||
    date1.getDate() !== date2.getDate()
  );
};

// Create a new patient with a three-digit token number
const createPatient = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the maximum token number for today
    const maxTokenNumber = await Patient.findOne({
      createdAt: { $gte: today },
    })
      .sort("-tokenNumber")
      .select("tokenNumber")
      .lean();

    // Initialize a new token number
    let newTokenNumber;

    // Check if it's a different day or there are no patients today
    if (
      !maxTokenNumber ||
      isDifferentDay(new Date(maxTokenNumber.createdAt), today)
    ) {
      newTokenNumber = 1; // Start from 1 if it's a different day or no patients
    } else {
      newTokenNumber = maxTokenNumber.tokenNumber + 1; // Increment the token number
    }

    // Create a new patient with the assigned token number
    const patient = new Patient({
      ...req.body,
      tokenNumber: newTokenNumber,
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the patient" });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Patient.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching appointments" });
  }
};

// Other CRUD operations can be implemented here as needed

module.exports = {
  createPatient,
  getAllAppointments,
  // Add other controller functions here
};
