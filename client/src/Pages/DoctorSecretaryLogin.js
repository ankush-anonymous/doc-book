import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorSecretaryLogin = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handlePhoneNumberChange = (event) => {
    const newPhoneNumber = event.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(newPhoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const roleResponse = await axios.get(
        `http://localhost:5000/api/v1/admin/roles?phoneNumber=${phoneNumber}`
      );

      if (roleResponse.data.roles[0].isDoctorSec) {
        // User is authorized, proceed with login
        const data = {
          phoneNumber,
          password,
        };

        try {
          const response = await axios.post(
            "http://localhost:5000/api/v1/employee/login",
            data
          );

          if (response.status === 200) {
            toast.success("Doctor's Secretary logged in successfully");

            // Store the token in local storage
            localStorage.setItem("doctor_sec_authorised", "true");
            localStorage.setItem("token", response.data.token);

            // Navigate to the doctor's secretary page
            navigate("/doctorSec/home");
          } else {
            toast.error("Failed to log in. Please check your credentials.");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("An error occurred. Please try again.");
        }
      } else {
        // User is not authorized
        toast.error("User not authorized.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full sm:w-96 bg-white rounded shadow p-6">
          <h2 className="text-2xl mb-4">Doctor's Secretary Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-2 text-sm">
                Phone Number (10-digit only):
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={10}
                placeholder="Enter your phone number"
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
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Login
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default DoctorSecretaryLogin;
