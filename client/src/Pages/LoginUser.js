import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import OTPVerificationModal from "../Components/OTPVerificationModal";

Modal.setAppElement("#root");

const LoginUser = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handlePhoneNumberChange = (event) => {
    const newPhoneNumber = event.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(newPhoneNumber);
  };

  const handleGetOTP = async () => {
    if (phoneNumber.length !== 10) {
      toast.error("Enter a 10-digit valid phone number.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user?phoneNumber=${phoneNumber}`
      );
      if (response.data.count !== 1) {
        toast.warn("User Not Registered. Please Register");
        return;
      }

      await axios.post("http://localhost:5000/api/v1/otp/request-otp", {
        phoneNumber: `+91${phoneNumber}`,
      });

      setOtpSent(true);
      setIsModalOpen(true); // Open the OTP verification modal
      toast.success("OTP sent.");
    } catch (error) {
      console.error("Error while requesting OTP:", error);
      toast.error(
        "You have just requested the OTP. Please try again after sometime."
      );
    }
  };

  const handleEnterOTP = () => {
    setIsModalOpen(true); // Open the OTP verification modal
  };

  const handleVerifyOTP = async () => {
    try {
      // Attempt user login
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        {
          phoneNumber,
        }
      );
      console.log(response.data);
      if (response.data) {
        // Set user data in localStorage (adjust the keys according to your API response)
        localStorage.setItem("user_authorised", true);

        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("phoneNumber", response.data.phoneNumber);
        localStorage.setItem("token", response.data.token);

        // Close the modal after successful login
        setIsModalOpen(false);

        // Show success toast and navigate to /appointment
        toast.success("User logged in successfully.");
        navigate("/user/home"); // Use useNavigate to navigate

        // You can also redirect the user to a dashboard or profile page
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error while attempting login:", error);
      toast.error(
        "An error occurred while attempting login. Please try again."
      );
    }
  };

  const handleLogin = async () => {
    if (phoneNumber.length !== 10) {
      toast.error("Enter a 10-digit valid phone number.");
      return;
    }

    try {
      // const response = await axios.get(
      //   `http://localhost:5000/api/v1/user?phoneNumber=${phoneNumber}`
      // );
      const postdata = {
        phoneNumber,
      };
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        postdata
      );
      console.log(response);
      if (response.status === 401) {
        toast.warn("User Not Registered. Please Register");
        return;
      } // Set user data in localStorage (adjust the keys according to your API response)

      localStorage.setItem("user_authorised", true);

      localStorage.setItem("name", response.data.user.name);
      localStorage.setItem("phoneNumber", response.data.phoneNumber);
      localStorage.setItem("token", response.data.token);

      // Close the modal after successful login
      setIsModalOpen(false);

      // Show success toast and navigate to /appointment
      toast.success("User logged in successfully.");
      navigate("/user/home"); // Use useNavigate to navigate
    } catch (error) {
      console.error("Error while attempting login:", error);
      toast.error(
        "An error occurred while attempting login. Please try again."
      );
    }
  };

  return (
    <div className="flex h-screen">
      {/* First 2/3 part with bg-user_primary and image */}
      <div className="w-2/3 bg-user_primary relative p-20 md:p-9">
        <img
          src="https://res.cloudinary.com/dtjg2hgky/image/upload/v1692109851/cld-sample-4.jpg"
          alt="Background Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Next 1/3 part with bg-user_secondary and registration form */}
      <div className="w-1/3 bg-user_secondary">
        <div className="flex flex-col justify-start items-center h-screen">
          {/* Logo */}
          <img
            src="https://res.cloudinary.com/dtjg2hgky/image/upload/v1694386065/logo_final_tdx2so.png"
            alt="Logo"
            className="h-96 lg:mb-8 mb-5"
          />

          <div className="bg-white p-8 rounded-md shadow-md w-4/5">
            <h2 className="text-2xl text-center font-semibold mb-4">
              User Login
            </h2>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-user_primary text-white py-2 rounded-md hover:bg-teal-500 delay-200 ease-in-out duration-150 focus:outline-none"
            >
              Get OTP
            </button>
            {/* {otpSent && (
              <div className="text-center mt-2">
                <button
                  onClick={handleLogin}
                  className="text-blue-500 cursor-pointer"
                >
                  Enter OTP
                </button>
              </div>
            )} */}
            <p className="text-lg">
              Not Registered Yet?{" "}
              <button
                onClick={() => navigate("/user/register")}
                className="text-blue-500 cursor-pointer"
              >
                Register
              </button>
              .
            </p>
          </div>
        </div>
      </div>

      <OTPVerificationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOTP}
      />
      <ToastContainer />
    </div>
  );
};

export default LoginUser;
