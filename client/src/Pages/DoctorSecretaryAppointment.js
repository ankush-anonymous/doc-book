import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DoctorSecretaryAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [arrivedPatients, setArrivedPatients] = useState([]);
  const [notArrivedPatients, setNotArrivedPatients] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchData = async () => {
      let dataFetched = false;

      while (!dataFetched) {
        try {
          await fetchTodaysAppointment();
          dataFetched = true; // Set to true when data is successfully fetched
        } catch (error) {
          console.log("Error fetching data:", error);
          // Optionally, you can add a delay here before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        }
      }
    };

    fetchData();
  }, []);

  const fetchTodaysAppointment = async () => {
    try {
      // Fetch today's appointments
      const todayResponse = await axios.get(
        "http://localhost:5000/api/v1/appointment/today"
      );

      const todayAppointments = todayResponse.data.appointments;

      // Fetch patient details, slots info, and doc info for each appointment
      const updatedAppointments = await Promise.all(
        todayAppointments.map(async (appointment) => {
          // Fetch patient details for the appointment
          const patientResponse = await axios.get(
            `http://localhost:5000/api/v1/user?phoneNumber=${appointment.userPhone}`
          );

          // Fetch slots info for the appointment
          if (appointment.slotId) {
            const slotResponse = await axios.get(
              `http://localhost:5000/api/v1/slots/${appointment.slotId}`
            );
            appointment.slotInfo = [
              slotResponse.data.slot.startTime,
              slotResponse.data.slot.endTime,
            ];
          }

          // Fetch doctor info for the appointment
          if (appointment.doctorId) {
            const doctorResponse = await axios.get(
              `http://localhost:5000/api/v1/admin/employee/${appointment.doctorId}`
            );
            appointment.doctorName = doctorResponse.data.name;
          }

          // Fetching patient details here and adding to the appointment
          const userName = patientResponse.data.user[0].name;
          appointment.patientDetails = { userName };

          return appointment;
        })
      );

      // Update the appointments state with all of the updated appointments
      setAppointments(updatedAppointments);

      // Sort the appointments by time
      sortAppointments(updatedAppointments);
    } catch (err) {
      console.log(err);
      console.log("Error fetching data");
    }
  };

  // Function to categorize appointments
  const sortAppointments = (appointments) => {
    const arrivedPatients = [];
    const notArrivedPatients = [];

    appointments.forEach((appointment) => {
      if (appointment.status === "Arrived") {
        arrivedPatients.push(appointment);
      } else {
        notArrivedPatients.push(appointment);
      }
    });
    setArrivedPatients(arrivedPatients);
    setNotArrivedPatients(notArrivedPatients);
    return { arrivedPatients, notArrivedPatients };
  };

  const handleNotArrivedClick = async (appointmentId) => {
    try {
      // Send an API request to update the appointment status to "Arrived"
      const response = await axios.patch(
        `http://localhost:5000/api/v1/appointment/${appointmentId}`,
        {
          status: "Arrived",
          modifiedAt: new Date(),
        }
      );

      if (response.data) {
        // Fetch the updated list of appointments
        fetchTodaysAppointment();

        // Delay the execution of the page reload by 100 milliseconds
        window.location.reload();
      }
    } catch (error) {
      console.error("Error marking appointment as arrived:", error);
      // Handle the error as needed
    }
  };
  const handleArrivedClick = async (appointmentId) => {
    try {
      // Send an API request to update the appointment status to "Arrived"
      const response = await axios.patch(
        `http://localhost:5000/api/v1/appointment/${appointmentId}`,
        {
          status: "Booked",
          modifiedAt: new Date(),
        }
      );

      if (response.data) {
        // Fetch the updated list of appointments
        fetchTodaysAppointment();

        window.location.reload();
      }
    } catch (error) {
      console.error("Error marking appointment as arrived:", error);
      // Handle the error as needed
    }
  };

  return (
    <div className="py-4 px-4 bg-user_primary h-screen">
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-user_secondary">
          Arrived Patients
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full max-h-max mb-20">
            <thead>
              <tr className="bg-user_secondary text-black">
                <th className="px-1 py-1 text-center">Token No.</th>
                <th className="px-6 py-3 text-center">Patient's Name</th>
                <th className="px-6 py-3 text-center">Phone Number</th>
                <th className="px-6 py-3 text-center">Slot Timing</th>
                <th className="px-6 py-3 text-center">Doctor's Name</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {arrivedPatients.length === 0 ? (
                <tr className="bg-gray-100">
                  <td className="px-6 py-4 text-center">--</td>
                  <td className="px-6 py-4 text-center">--</td>
                  <td className="px-6 py-4 text-center">--</td>
                  <td className="px-6 py-4 text-center">--</td>
                  <td className="px-6 py-4 text-center">--</td>
                  <td className="px-6 py-4 text-center">--</td>
                </tr>
              ) : (
                arrivedPatients.map((appointment, index) => (
                  <tr key={appointment._id} className="bg-gray-100">
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-center">
                      {appointment.patientDetails.userName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {appointment.userPhone}
                    </td>
                    <td className="px-6 py-4 text-center">{`${appointment.slotInfo[0]} - ${appointment.slotInfo[1]}`}</td>
                    <td className="px-6 py-4 text-center">
                      {appointment.doctorName}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                        onClick={() => handleArrivedClick(appointment._id)}
                      >
                        Arrived
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-user_secondary">
          Today's Appointments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full max-h-max ">
            <thead>
              <tr className="bg-user_secondary text-black">
                <th className="px-4 py-3 text-center">Patient's Name</th>
                <th className="px-4 py-3 text-center">Phone Number</th>
                <th className="px-4 py-3 text-center">Slot Timing</th>
                <th className="px-6 py-3 text-center">Doctor's Name</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {notArrivedPatients.length === 0 ? (
                <tr className="bg-gray-100">
                  <td className="px-6 py-4 text-center">--</td>
                  <td className="px-6 py-4 text-center">--</td>
                  <td className="px-6 py-4 text-center">--</td>
                  <td className="px-6 py-4 text-center">--</td>
                  <td className="px-6 py-4 text-center">--</td>
                </tr>
              ) : (
                notArrivedPatients.map((appointment) => (
                  <tr key={appointment._id} className="bg-gray-100">
                    <td className="px-6 py-4 text-center">
                      {appointment.patientDetails.userName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {appointment.userPhone}
                    </td>
                    <td className="px-6 py-4 text-center">{`${appointment.slotInfo[0]} - ${appointment.slotInfo[1]}`}</td>
                    <td className="px-6 py-4 text-center">
                      {appointment.doctorName}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                        onClick={() => handleNotArrivedClick(appointment._id)}
                      >
                        Not Arrived
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DoctorSecretaryAppointment;
