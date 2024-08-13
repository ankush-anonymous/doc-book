import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [patientData, setPatientData] = useState({});
  const [checkedRows, setCheckedRows] = useState([]);
  const [slotInfoMap, setSlotInfoMap] = useState({});

  const DocName = localStorage.getItem("DocName");

  const navigate = useNavigate();

  const fetchSlotInfo = async (slotId) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `http://localhost:5000/api/v1/slots/${slotId}`
      );
      return response.data.slot;
    } catch (error) {
      console.error("Error fetching slot information:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Get docId from localStorage
    const docId = localStorage.getItem("DocId");

    // Get today's date in 'YYYY-MM-DD' format
    const today = new Date().toISOString().split("T")[0];
    axios
      .get(`http://localhost:5000/api/v1/appointment/?date=${today}`)
      .then((response) => {
        // Get all today's appointments
        const todayAppointments = response.data.appointments;

        // Filter only today's appointments and appointments matching docId
        const filteredAppointments = todayAppointments.filter(
          (appointment) => appointment.doctorId === docId
        );

        setAppointments(filteredAppointments);

        // Update checkedRows based on checkbox criteria
        const newCheckedRows = filteredAppointments.reduce(
          (checkedRows, appointment, index) =>
            appointment.isChecked ? [...checkedRows, index] : checkedRows,
          []
        );
        setCheckedRows(newCheckedRows);

        // Fetch slot information for each appointment's slotId
        const fetchSlotInfoForAppointments = async () => {
          const slotIds = filteredAppointments.map(
            (appointment) => appointment.slotId
          );

          const slotInfoPromises = slotIds.map((slotId) =>
            fetchSlotInfo(slotId)
          );
          const slotInfoResponses = await Promise.all(slotInfoPromises);
          const newSlotInfoMap = {};
          slotInfoResponses.forEach((slotInfo, index) => {
            newSlotInfoMap[slotIds[index]] = slotInfo;
          });
          setSlotInfoMap(newSlotInfoMap);
        };

        fetchSlotInfoForAppointments();
      })
      .catch((error) => {
        toast("Error fetching appointments");
        console.error("Error fetching appointments:", error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchPatientData = async () => {
      const fetchedData = await Promise.all(
        appointments.map((appointment) =>
          axios.get(
            `http://localhost:5000/api/v1/user?phoneNumber=${appointment.userPhone}`
          )
        )
      );

      const patientDetails = fetchedData.map(
        (response) => response.data.user[0]
      );
      setPatientData(patientDetails);
    };

    fetchPatientData();
  }, [appointments]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // Refresh the page after logout
    navigate("/doctor/login");
  };

  const getTimeOfDayGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const handleCheckboxChange = async (index) => {
    const appointment = appointments[index];
    const appointmentId = appointment._id;
    const isChecked = !appointment.isChecked; // Toggle the isChecked value

    // Update checkbox status in the local state
    const newCheckedRows = isChecked
      ? [...checkedRows, index]
      : checkedRows.filter((item) => item !== index);
    setCheckedRows(newCheckedRows);

    // Update checkbox status in the database
    await updateCheckboxStatus(appointmentId, isChecked);

    // Update the appointment's isChecked status in the state
    setAppointments((prevAppointments) => {
      const updatedAppointments = prevAppointments.map((app, idx) =>
        idx === index ? { ...app, isChecked } : app
      );
      return updatedAppointments;
    });
  };

  const updateCheckboxStatus = async (appointmentId, isChecked) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.patch(
        `http://localhost:5000/api/v1/appointment/${appointmentId}`,
        { isChecked }
      );
    } catch (error) {
      console.error("Error updating checkbox status:", error);
    }
  };

  // Function to perform automatic logout after 15 minutes of inactivity
  const performAutomaticLogout = () => {
    toast.info("You have been logged out due to inactivity");
    handleLogout();
  };

  // Set up a timer for automatic logout after 15 minutes
  let inactivityTimer;
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(performAutomaticLogout, 15 * 60 * 1000); // 15 minutes in milliseconds
  };

  useEffect(() => {
    // Start the inactivity timer when the component mounts
    resetInactivityTimer();

    // Add event listeners to reset the timer on user interaction
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    // Clean up event listeners when the component unmounts
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-green-100 to-green-300 min-h-screen p-8">
      <div className="flex justify-end mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <h1 className="text-4xl mb-4 text-green-700">
        {getTimeOfDayGreeting()}, Dr. {DocName}!
      </h1>
      <div className="bg-white text-lg shadow-md rounded-md p-4">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2">Name of patient</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Age</th>
              <th className="p-2">Time Slot</th>
              <th className="p-2">Checked</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <h1 className="text-xl">
                    No appointments confirmed for today Doctor!!!!
                  </h1>
                </td>
              </tr>
            ) : (
              appointments.map((appointment, index) => {
                const slotInfo = slotInfoMap[appointment.slotId];
                const hasPatientData = Boolean(patientData[index]);

                return (
                  <tr
                    key={appointment._id}
                    className={`transition ${
                      checkedRows.includes(index) ? "bg-green-200" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="p-2">
                      {hasPatientData && patientData[index].name}
                    </td>
                    <td className="p-2">
                      {hasPatientData && patientData[index].gender}
                    </td>
                    <td className="p-2">
                      {hasPatientData && patientData[index].age}
                    </td>
                    <td className="p-2">
                      {slotInfo &&
                        `${slotInfo.startTime} - ${slotInfo.endTime}`}
                    </td>
                    <td className="p-2">
                      {hasPatientData && (
                        <input
                          type="checkbox"
                          checked={checkedRows.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointment;
