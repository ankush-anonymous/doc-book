const Emp = require("../models/EmployeeSchema"); // Import your Employee model
const { StatusCodes } = require("http-status-codes");
const axios = require("axios");

// Get all Employees
const getAllEmps = async (req, res) => {
  try {
    const { name, phoneNumber, dateOfBirth, bloodGroup } = req.query;
    const queryObject = {};

    if (phoneNumber) {
      queryObject.phoneNumber = phoneNumber;
    }
    if (name) {
      queryObject.name = name;
    }
    if (dateOfBirth) {
      queryObject.dateOfBirth = dateOfBirth;
    }
    if (bloodGroup) {
      queryObject.bloodGroup = bloodGroup;
    }

    const users = await Emp.find(queryObject);
    res.status(StatusCodes.OK).json({ users, count: users.length });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching employees", error: error.message });
  }
};

// Get a single Employee by ID
const getSingleEmp = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Emp.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Employee", error: error.message });
  }
};

// Delete an Employee by ID
const deleteEmp = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Emp.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
};

const updateEmp = async (req, res) => {
  const { id } = req.params; // Assuming you're passing the employee ID in the URL parameter
  const { name, phoneNumber, password, dateOfBirth, bloodGroup, address } =
    req.body; // Fields you want to update

  if (
    name === "" ||
    phoneNumber === "" ||
    password === "" ||
    dateOfBirth === "" ||
    address === "" ||
    bloodGroup === ""
  ) {
    throw new BadRequestError("No fields cannot be empty");
  }

  try {
    const updatedEmployee = await Emp.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // Return the updated document
    );

    if (updatedEmployee) {
      res.status(200).json({ success: true, data: updatedEmployee });
    } else {
      res.status(404).json({ success: false, message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const fetchAllDoctors = async (req, res) => {
  try {
    // Fetch doctor roles from an external API or your database
    const response = await axios.get(
      "http://localhost:5000/api/v1/admin/roles?isDoctor=true"
    );
    const doctorRoles = response.data.roles;

    const doctorDetailsArray = [];

    for (const doctorRole of doctorRoles) {
      // Fetch additional details for each doctor
      const userDetailsResponse = await axios.get(
        `http://localhost:5000/api/v1/admin/employees?phoneNumber=${doctorRole.phoneNumber}`
      );

      const doctorUserDetails = userDetailsResponse.data.users[0];
      const doctorDetails = {
        _id: doctorUserDetails._id,
        name: doctorUserDetails.name,
        phoneNumber: doctorUserDetails.phoneNumber,
      };

      doctorDetailsArray.push(doctorDetails);
    }

    res
      .status(StatusCodes.OK)
      .json({ doctorDetailsArray, count: doctorDetailsArray.length });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching doctors." });
  }
};

module.exports = {
  getAllEmps,
  getSingleEmp,
  deleteEmp,
  updateEmp,
  fetchAllDoctors,
};
