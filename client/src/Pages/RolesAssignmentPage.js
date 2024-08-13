import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../Components/AdminNavbar";

function RolesAssignmentPage() {
  const [employees, setEmployees] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchDoctors();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:5000/api/v1/admin/employees")
      .then((response) => {
        fetchRolesAndCombineData(response.data.users);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  };

  const fetchDoctors = () => {
    axios
      .get("http://localhost:5000/api/v1/admin/doctor-detail")
      .then((response) => {
        const doctorDetailsArray = response.data.doctorDetailsArray;

        // Use the spread operator to add objects to the doctorsList array
        setDoctorsList([...doctorsList, ...doctorDetailsArray]);

        console.log("doctors List", doctorsList);
      });
  };

  const fetchRolesAndCombineData = async (employeesData) => {
    const promises = employeesData.map(async (employee) => {
      try {
        const rolesResponse = await axios.get(
          `http://localhost:5000/api/v1/admin/roles?phoneNumber=${employee.phoneNumber}`
        );
        return {
          ...employee,
          roles: rolesResponse.data,
        };
      } catch (error) {
        console.error("Error fetching roles:", error);
        return employee;
      }
    });

    const employeesWithRoles = await Promise.all(promises);
    setEmployees(employeesWithRoles);
  };

  const handleRoleChange = async (employeeIndex, role, newValue) => {
    setEmployees((prevEmployees) => {
      const updatedEmployees = [...prevEmployees];
      updatedEmployees[employeeIndex].roles.roles[0][`is${role}`] = newValue;
      setIsDirty(true);
      return updatedEmployees;
    });
  };

  const handleRoleUpdate = async (employee) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/admin/update-roles`,
        {
          phoneNumber: employee.phoneNumber,
          isAdmin: employee.roles.roles[0].isAdmin,
          isDoctor: employee.roles.roles[0].isDoctor,
          isDoctorSec: employee.roles.roles[0].isDoctorSec,
        }
      );

      if (response.status === 200) {
        toast.success("Roles updated Successfully...");
      } else {
        // Update failed, handle the error
      }
    } catch (error) {
      console.error("Error updating roles:", error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Roles Assignment</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Employee Name</th>
              <th className="py-2 px-4">Phone Number</th>
              <th className="py-2 px-4">Admin</th>
              <th className="py-2 px-4">Doctor</th>
              <th className="py-2 px-4">Doctor's Secretary</th>
              <th className="py-2 px-4">Update</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee.phoneNumber} className="border-t">
                <td className="py-2 px-4 text-center">{employee.name}</td>
                <td className="py-2 px-4 text-center">
                  {employee.phoneNumber}
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    className={`py-1 px-2 rounded ${
                      employee.roles.roles[0].isAdmin
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white`}
                    onClick={() =>
                      handleRoleChange(
                        index,
                        "Admin",
                        !employee.roles.roles[0].isAdmin
                      )
                    }
                  >
                    {employee.roles.roles[0].isAdmin ? "Admin" : "Not Admin"}
                  </button>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    className={`py-1 px-2 rounded ${
                      employee.roles.roles[0].isDoctor
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white`}
                    onClick={() =>
                      handleRoleChange(
                        index,
                        "Doctor",
                        !employee.roles.roles[0].isDoctor
                      )
                    }
                  >
                    {employee.roles.roles[0].isDoctor ? "Doctor" : "Not Doctor"}
                  </button>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    className={`py-1 px-2 rounded ${
                      employee.roles.roles[0].isDoctorSec
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white`}
                    onClick={() => {
                      handleRoleChange(
                        index,
                        "DoctorSec",
                        !employee.roles.roles[0].isDoctorSec
                      );
                    }}
                  >
                    {employee.roles.roles[0].isDoctorSec
                      ? "Doctor's Secretary"
                      : "Not Doctor's Secretary"}
                  </button>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    className={`bg-blue-500 text-white py-1 px-2 rounded`}
                    onClick={() => handleRoleUpdate(employee)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer />
      </div>
    </>
  );
}

export default RolesAssignmentPage;
