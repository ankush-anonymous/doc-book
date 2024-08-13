import React, { useState } from "react";
import Modal from "react-modal";
import { toast, ToastContainer, cloneElement } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const OTPVerificationModal = ({
  isOpen,
  onRequestClose,
  phoneNumber,
  onVerify,
}) => {
  const [otp, setOTP] = useState("");

  const handleOTPChange = (event) => {
    setOTP(event.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      // Show an error message or toast if OTP is not 6 digits
      toast.error("Enter a 6-digit OTP.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/otp/verify-otp",
        {
          phoneNumber: `+91${phoneNumber}`,
          otp: otp,
        }
      );

      if (response.data) {
        toast.success("OTP verified successfully.");
        onVerify();
        onRequestClose();
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle 400 status (Bad Request)
        toast.error("Incorrect OTP. Please try again.");
      } else {
        console.error("Error while verifying OTP:", error);
        toast.error("An error occurred while verifying OTP. Please try again.");
      }
    }

    setOTP(""); // Reset the OTP input field
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="OTP Verification Modal"
      className="bg-white rounded-md p-4 md:mx-0 md:max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      overlayClassName="fixed inset-0 bg-black opacity-100"
    >
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        onClick={onRequestClose}
      >
        <span className="text-xl">×</span>
      </button>
      <h2 className="text-2xl mb-4">Verify OTP</h2>
      <p>Enter the OTP sent to {phoneNumber}</p>
      <input
        type="text"
        value={otp}
        onChange={handleOTPChange}
        placeholder="Enter 6-digit OTP"
        maxLength="6"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2"
      />
      <button
        onClick={handleVerify}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none w-full"
      >
        Verify
      </button>
    </Modal>
  );
};

export default OTPVerificationModal;
