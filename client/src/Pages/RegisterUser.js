import React, { useState } from "react";
import { toast, ToastContainer, cloneElement } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import OTPVerificationModal from "../Components/OTPVerificationModal";

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const handlePhoneNumberChange = (event) => {
    const newPhoneNumber = event.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(newPhoneNumber);
  };

  const handleRegister = async () => {
    if (!name || !age || !gender || !phoneNumber) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (phoneNumber.length !== 10) {
      toast.error("Enter a 10-digit valid phone number.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user?phoneNumber=${phoneNumber}`
      );

      if (response.data.count === 1) {
        toast.error("User Already registered. Please login");
        return;
      }

      await axios.post("http://localhost:5000/api/v1/otp/request-otp", {
        phoneNumber: `+91${phoneNumber}`,
      });
      setOtpSent(true);
      toast.success("OTP sent.");
      setIsModalOpen(true); // Open the OTP verification modal
    } catch (error) {
      console.error("Error while registering or requesting OTP:", error);
      toast.error(
        "You Requested OTP just now. Please try again after sometime."
      );
    }
  };

  const handleEnterOTP = () => {
    setIsModalOpen(true); // Open the OTP verification modal
  };

  const handleVerifyOTP = async () => {
    try {
      console.log(phoneNumber);
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          name,
          age,
          gender,
          phoneNumber,
        }
      );
      console.log(response.data);

      if (response.data) {
        // Set user data in localStorage
        localStorage.setItem("user_authorised", true);
        localStorage.setItem("name", name);
        localStorage.setItem("phoneNumber", phoneNumber);
        localStorage.setItem("token", response.data.token);

        setIsModalOpen(false); // Close the modal
        toast.success("User registered successfully.");
        navigate("/appointment"); // Redirect to appointment page
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error while attempting registration:", error);
      toast.error(
        "An error occurred while attempting registration. Please try again."
      );
    }
  };

  return (
    <div className="flex h-screen">
      {/* First 2/3 part with bg-user_primary and image (hidden on tablet, mobile, and iPad) */}
      <div className="hidden lg:block md:hidden  w-2/3 bg-user_primary relative p-20 md:p-9">
        <img
          src="https://res.cloudinary.com/dtjg2hgky/image/upload/v1692109851/cld-sample-4.jpg"
          alt="Background Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Next 1/3 part with bg-user_secondary and registration form */}
      <div className="w-full lg:w-1/3 md:w-full bg-user_secondary">
        <div className="flex flex-col justify-start items-center h-screen">
          {/* Logo */}
          <img
            src="https://res.cloudinary.com/dtjg2hgky/image/upload/v1694386065/logo_final_tdx2so.png"
            alt="Logo"
            className="h-96 md:h-72 mb-2"
          />
          <div className="bg-white p-8 rounded-md shadow-md w-4/5">
            <h2 className="text-2xl text-center font-semibold mb-4">
              Register User
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Phone Number"
              maxLength="10"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <button
              onClick={handleRegister}
              className="w-full bg-user_primary text-white py-2 rounded-md hover:bg-teal-500 delay-200 ease-in-out duration-150 focus:outline-none"
            >
              Verify and Register
            </button>
            {otpSent && (
              <div className="text-center mt-2">
                <button
                  onClick={handleEnterOTP}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Enter OTP
                </button>
              </div>
            )}
            <p>
              Already Registered?{" "}
              <button
                onClick={() => navigate("/user/login")}
                className="text-blue-500 cursor-pointer"
              >
                Login.
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
