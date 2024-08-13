import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function UpdateEmployeePage() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Renamed the state variable
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const { id } = useParams(); // This is the parameter from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEmployeeData = {
      name,
      phoneNumber,
      password,
      dateOfBirth,
      bloodGroup,
      address,
    };

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/admin/employee/${id}`,
        updatedEmployeeData
      );

      if (response.status === 200) {
        toast.success("Employee data updated successfully");
        navigate("/admin/employee-details");
      } else {
        toast.error("Error updating employee data.");
      }
    } catch (error) {
      console.error("Error updating employee data:", error);
    }
  };

  useEffect(() => {
    // Fetch employee details using id
    fetchEmployeeById();
  }, []);

  const fetchEmployeeById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/admin/employee/${id}`
      );
      const employeeData = response.data; // Assuming the response is an array
      if (employeeData) {
        setName(employeeData.name);
        setPhoneNumber(employeeData.phoneNumber);
        setPassword(employeeData.password);
        setDateOfBirth(employeeData.dateOfBirth);
        setBloodGroup(employeeData.bloodGroup);
        setAddress(employeeData.address);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen my-20">
      <div className="w-full sm:w-96 bg-white rounded shadow p-6">
        <h2 className="text-2xl mb-4">Update Employee Details</h2>
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

          {/* update phoneNumber kept on hold */}
          {/* <div className="mb-4">
            <label htmlFor="phoneNumber" className="block mb-2 text-sm">
              Phone Number:
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength="10"
              placeholder="Enter 10 digit number"
              className="w-full px-3 py-2 border rounded"
            />
          </div> */}

          {/* update password kept on hold */}
          {/* <div className="mb-4">
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
          </div> */}
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
            Update Details
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UpdateEmployeePage;
