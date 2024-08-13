const { StatusCodes } = require("http-status-codes");
const RolesSchema = require("../models/RolesSchema");

const getAllRoles = async (req, res) => {
  const { phoneNumber, isAdmin, isDoctor, isDoctorSec } = req.query;
  const queryObject = {};

  if (phoneNumber) {
    queryObject.phoneNumber = phoneNumber;
  } else {
    if (isAdmin === "true") {
      queryObject.isAdmin = true;
    }
    if (isDoctor === "true") {
      queryObject.isDoctor = true;
    }
    if (isDoctorSec === "true") {
      queryObject.isDoctorSec = true;
    }
  }

  try {
    const roles = await RolesSchema.find(queryObject);
    res.status(StatusCodes.OK).json({ roles, count: roles.length });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching roles." });
  }
};

const initializeRoles = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const newRoles = new RolesSchema({
      phoneNumber,
      isAdmin: false,
      isDoctor: false,
      isDoctorSec: false,
    });

    await newRoles.save();

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Roles initialized successfully." });
  } catch (error) {
    console.error("Error initializing roles:", error); // Log the error
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error initializing roles." });
  }
};

const deleteRoles = async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    // Find and delete roles based on phoneNumber
    const deletedRoles = await RolesSchema.findOneAndDelete({ phoneNumber });

    if (!deletedRoles) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Roles not found for the given phone number." });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Roles deleted successfully." });
  } catch (error) {
    console.error("Error deleting roles:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting roles." });
  }
};

const updateRoles = async (req, res) => {
  const {
    phoneNumber,
    isAdmin,
    isDoctor,
    isDoctorSec,
    selectedDoctorPhoneNumber, // Extract the selected doctor's phone number
  } = req.body;

  try {
    const filter = { phoneNumber };
    const update = {
      isAdmin,
      isDoctor,
      isDoctorSec,
      selectedDoctorPhoneNumber, // Include the selected doctor's phone number in the update
    };

    // Update rolesSchema using Mongoose updateOne or findOneAndUpdate
    const updatedRoles = await RolesSchema.findOneAndUpdate(
      filter,
      update,
      { new: true } // To get the updated document
    );

    if (!updatedRoles) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No matching record found." });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Roles updated successfully." });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating roles." });
  }
};

module.exports = { deleteRoles, getAllRoles, initializeRoles, updateRoles };
