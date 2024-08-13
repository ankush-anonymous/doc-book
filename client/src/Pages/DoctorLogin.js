import React, { useState } from "react";
import { toast, ToastContainer, cloneElement } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const roleResponse = await axios.get(
        `http://localhost:5000/api/v1/admin/roles?phoneNumber=${phoneNumber}`
      );

      if (roleResponse.data.roles[0].isDoctor) {
        // User is authorized as a doctor, proceed with login
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
            toast.success("Welcome Doctor", {
              position: toast.POSITION.TOP_CENTER,
            });
            localStorage.setItem("doctor_authorised", "true");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("DocId", response.data.user.Id);
            localStorage.setItem("DocName", response.data.user.name);
            setPhoneNumber("");
            setPassword("");
            navigate("/doctor/home");
          } else {
            toast.error("Failed to log in. Please check your credentials.");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("An error occurred. Please try again.");
        }
      } else {
        // User is not authorized as a doctor
        toast.error("You are not authorized as a Doctor.", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-green-100 to-green-300">
      <ToastContainer />
      <h1 className="text-3xl mb-6 text-green-700">Hi Doctor!!</h1>
      <div className="bg-green-50 p-6 shadow-md rounded-md">
        <input
          type="text"
          placeholder="Phone Number"
          className="mb-4 p-2 w-full border border-green-200 rounded"
          value={phoneNumber}
          onChange={(e) =>
            setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 w-full border border-green-200 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded w-full"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default DoctorLogin;
