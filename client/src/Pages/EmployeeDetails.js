import React, { useState, useEffect } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/admin/employees"
      );
      setEmployees(response.data.users);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleDelete = async (employeeId, phoneNumber) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      console.log(phoneNumber);
      // Delete associated roles first
      const rolesResponse = await axios.delete(
        `http://localhost:5000/api/v1/admin/delete-roles/${phoneNumber}`
      );

      if (rolesResponse.status === 200) {
        // If roles deletion is successful, then delete the employee
        try {
          const employeeResponse = await axios.delete(
            `http://localhost:5000/api/v1/admin/employee/${employeeId}`
          );
          if (employeeResponse.status === 200) {
            toast.success("Employee and associated roles deleted successfully");
            fetchEmployeeData(); // Fetch updated employee data after deletion
          } else {
            toast.error("Error deleting employee.");
          }
        } catch (employeeError) {
          toast.error("Error deleting employee:", employeeError.message);
        }
      } else {
        toast.error("Error deleting associated roles.");
      }
    } catch (rolesError) {
      toast.error("Error deleting associated roles:", rolesError.message);
    }
  };

  const handleUpdate = (employee) => {
    // Redirect to update page with employee data
    navigate(`/admin/update-employee/${employee._id}`);
  };

  
  return (
    <>
      <AdminNavbar />
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Employee Detail</h2>
          <div className="overflow-x-auto">
            <div className="w-full overflow-x-scroll">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-center">
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal text-center">
                  <tr>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Phone</th>
                    <th className="py-3 px-6">Date of Birth</th>
                    <th className="py-3 px-6">Blood Group</th>
                    <th className="py-3 px-6">Address</th>
                    <th className="py-3 px-6">Update</th>
                    <th className="py-3 px-6">Delete</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light ">
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="py-3 px-6 whitespace-nowrap">
                        {employee.name}
                      </td>
                      <td className="py-3 px-6">{employee.phoneNumber}</td>
                      <td className="py-3 px-6">{employee.dateOfBirth}</td>
                      <td className="py-3 px-6">{employee.bloodGroup}</td>
                      <td className="py-3 px-6 max-w-xs whitespace-normal">
                        {employee.address}
                      </td>
                      <td className="py-3 px-6 ">
                        <AiFillEdit onClick={() => handleUpdate(employee)} />
                      </td>
                      <td className="py-3 px-6">
                        <AiFillDelete
                          onClick={() =>
                            handleDelete(employee._id, employee.phoneNumber)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default EmployeeDetails;
