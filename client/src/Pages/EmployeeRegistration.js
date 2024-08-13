import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const EmployeeRegistration = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !phoneNumber ||
      !password ||
      !dateOfBirth ||
      !bloodGroup ||
      !address
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Phone number should be 10 digits.");
      return;
    }

    // Check if the employee already exists
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/employee/phone/${phoneNumber}`
      );

      if (response.data) {
        toast.info(
          "An employee with the provided phone number already exists. Please log in."
        );
        return;
      }
    } catch (error) {
      // If an error occurs, it means the employee does not exist, so we can continue with registration.
    }

    const data = {
      name,
      phoneNumber,
      password,
      dateOfBirth,
      bloodGroup,
      address,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/employee/register",
        data
      );

      if (response.status === 201) {
        // Registering employee succeeded
        toast.success("Employee registered successfully");

        // Now, make a call to update-roles
        try {
          const InitializeRolesResponse = await axios.post(
            "http://localhost:5000/api/v1/admin/initialize-roles",
            {
              phoneNumber: phoneNumber,
            }
          );
          if (InitializeRolesResponse.status === 201) {
            toast.success("Employee Roles Updated successfully");
          } else {
            console.error("Failed to initialize roles.");
          }
        } catch (error) {
          console.error("Error initializing roles:", error);
        }

        setName("");
        setPhoneNumber("");
        setPassword("");
        setDateOfBirth("");
        setBloodGroup("");
        setAddress("");
      } else {
        toast.error("Failed to register employee. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handlePhoneNumberChange = (event) => {
    const newPhoneNumber = event.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(newPhoneNumber);
  };

  return (
    <div className="flex justify-center items-center h-screen my-20">
      <div className="w-full sm:w-96 bg-white rounded shadow p-6">
        <h2 className="text-2xl mb-4">Employee Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block mb-2 text-sm">
              Phone Number:
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength="10"
              placeholder="Enter 10 digit number"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dateOfBirth" className="block mb-2 text-sm">
              Date of Birth:
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bloodGroup" className="block mb-2 text-sm">
              Blood Group:
            </label>
            <input
              type="text"
              id="bloodGroup"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              placeholder="Enter blood group"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 text-sm">
              Address:
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Verify and Register
          </button>
          <p>
            Already Registered?{" "}
            <button
              onClick={() => navigate("/employee/login")}
              className="text-blue-500 cursor-pointer"
            >
              Login.
            </button>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeRegistration;
