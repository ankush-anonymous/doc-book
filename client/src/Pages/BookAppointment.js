import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer, cloneElement } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PatientNavbar from "../Components/PatientNavbar";

const BookAppointment = () => {
  const [slots, setSlots] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const phoneNumber = localStorage.getItem("phoneNumber");
  const [doctorDetails, setDoctorDetails] = useState([]);

  useEffect(() => {
    fetchSlots();
    fetchAppointment(phoneNumber);
    fetchDoctorDetails();
  }, []);

  const fetchDoctorDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/admin/doctor-detail"
      );
      setDoctorDetails(response.data.doctorDetailsArray);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };
  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(
        "http://localhost:5000/api/v1/appointment/slots"
      );
      const slots = response.data.slots;

      // Sort slots in ascending order of start time
      slots.sort((slotA, slotB) => {
        const startTimeA = new Date(`1970-01-01T${slotA.startTime}`);
        const startTimeB = new Date(`1970-01-01T${slotB.startTime}`);
        return startTimeA - startTimeB;
      });

      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();

      // Pad the single-digit hours and minutes with leading zeros if needed
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      const filteredSlots = slots.filter((slot) => {
        if (slot.startTime > formattedTime) {
          return slots;
        }
      });
      if (filteredSlots.length > 0) {
        setSlots(filteredSlots);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointment = async (phoneNumber) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const today = new Date().toISOString().split("T")[0];

      const user = await axios.get(
        `http://localhost:5000/api/v1/appointment/?userPhone=${phoneNumber}&date=${today}`
      );
      const todaysAppointment = user.data.appointments;

      const appointmentWithTime = await Promise.all(
        todaysAppointment.map(async (appointment) => {
          const slotId = appointment.slotId;
          const slotResponse = await axios.get(
            `http://localhost:5000/api/v1/slots/${slotId}`
          );
          const startTime = slotResponse.data.slot.startTime;
          const endTime = slotResponse.data.slot.endTime;
          return {
            ...appointment,
            startTime,
            endTime,
          };
        })
      );

      const updatedAppointments = appointmentWithTime.map((appointment) => {
        if (appointment.isChecked) {
          return {
            ...appointment,
            status: "Visited",
          };
        } else {
        }
        return appointment;
      });

      setAppointment(updatedAppointments);
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error!!!");
    }
  };

  const handleBookAppointment = async (slotId) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const phoneNumber = localStorage.getItem("phoneNumber");
      const today = new Date().toISOString().split("T")[0];

      // Fetch user's appointments for today
      const userAppointmentsResponse = await axios.get(
        `http://localhost:5000/api/v1/appointment/?userPhone=${phoneNumber}&date=${today}`
      );

      if (userAppointmentsResponse.data.appointments.length > 0) {
        // User has already booked a slot for today
        toast.error(
          "You have already booked a slot for today. Please try again tomorrow."
        );
        return;
      }

      // Fetch slot details to get the current capacity
      const slotResponse = await axios.get(
        `http://localhost:5000/api/v1/slots/${slotId}`
      );

      const currentCapacity = slotResponse.data.slot.capacity;
      const doctorId = slotResponse.data.slot.doctorID;
      if (currentCapacity > 0) {
        // Book the slot
        const response = await axios.post(
          "http://localhost:5000/api/v1/appointment",
          {
            userPhone: phoneNumber,
            slotId: slotId,
            doctorId: doctorId,
          }
        );

        if (response.status === 201) {
          // Booking successful
          toast.success("Your slot is booked!");

          // Decrease the slot's capacity
          const updatedCapacity = currentCapacity - 1;
          await axios.patch(`http://localhost:5000/api/v1/slots/${slotId}`, {
            capacity: updatedCapacity,
          });

          // Refresh slots and bookings after booking
          fetchSlots();
          fetchAppointment(phoneNumber);
        } else {
          // Booking failed
          toast.error("Failed to book the slot.");
        }
      } else {
        // Slot capacity is full
        toast.error("Slot capacity is full. Please try booking another slot.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while booking the slot.");
    }
  };

  const handleCancelAppointment = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch the appointment details to get the slot ID
      const appointmentResponse = await axios.get(
        `http://localhost:5000/api/v1/appointment/${bookingId}`
      );

      const slotId = appointmentResponse.data.appointment.slotId;

      const response = await axios.delete(
        `http://localhost:5000/api/v1/appointment/${bookingId}`
      );

      if (response.status === 200) {
        // Cancellation successful
        toast.success("Appointment cancelled successfully!");

        // Increase the slot's capacity
        const slotResponse = await axios.get(
          `http://localhost:5000/api/v1/slots/${slotId}`
        );
        const currentCapacity = slotResponse.data.slot.capacity;

        const updatedCapacity = currentCapacity + 1;
        await axios.patch(`http://localhost:5000/api/v1/slots/${slotId}`, {
          capacity: updatedCapacity,
        });

        // Refresh bookings after cancellation
        fetchSlots();
        fetchAppointment(phoneNumber);
      } else {
        // Cancellation failed
        toast.error("Failed to cancel the appointment.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while cancelling the appointment.");
    }
  };

  // Function to perform automatic logout after 15 minutes of inactivity
  const performAutomaticLogout = () => {
    toast.info("You have been logged out due to inactivity");
    logout(); // Assuming you have a logout function
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload(); // Refresh the page after logout
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
    <>
      <PatientNavbar />
      <div className="bg-orange-100 pt-16 pb-8 flex-grow flex min-h-screen">
        <div className="container mx-auto flex flex-col justify-center items-center h-full">
          <div className="w-full max-w-4xl shadow-lg mb-8 mt-8">
            <div className="bg-white rounded-t-lg p-4">
              <h2 className="text-3xl font-bold mb-4">Your Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto bg-white rounded-lg">
                  <thead className="bg-orange-300">
                    <tr>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Phone Number</th>
                      <th className="border px-4 py-2">Doctor's Name</th>
                      <th className="border px-4 py-2">Time Slot</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Cancel</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {appointment.length === 0 ? (
                      <tr>
                        <td className="border px-4 py-2">
                          {localStorage.getItem("name")}
                        </td>
                        <td className="border px-4 py-2">
                          {localStorage.getItem("phoneNumber")}
                        </td>
                        <td className="border px-4 py-2">-</td>
                        <td className="border px-4 py-2">-</td>
                        <td className="border px-4 py-2">-</td>
                        <td className="border px-4 py-2">-</td>
                      </tr>
                    ) : (
                      appointment.map((booking) => (
                        <tr key={booking._id}>
                          <td className="border px-4 py-2">
                            {localStorage.getItem("name")}
                          </td>
                          <td className="border px-4 py-2">
                            {booking.userPhone}
                          </td>
                          <td className="border px-4 py-2">
                            {doctorDetails.map((doctor) =>
                              doctor._id === booking.doctorId
                                ? doctor.name
                                : null
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {booking.startTime} - {booking.endTime}
                          </td>
                          <td className="border px-4 py-2">{booking.status}</td>
                          <td className="border px-4 py-2">
                            {booking.status === "Visited" ? (
                              <button
                                className="bg-red-600 text-white font-bold px-4 py-2 rounded cursor-not-allowed"
                                disabled
                              >
                                Appointment Visited
                              </button>
                            ) : (
                              <button
                                className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded"
                                onClick={() =>
                                  handleCancelAppointment(booking._id)
                                }
                              >
                                Cancel Appointment
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-full max-w-4xl shadow-lg mb-8">
            <div className="bg-white rounded-t-lg p-4">
              <h2 className="text-3xl font-bold mb-4">Today's Slots</h2>
              {slots.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto bg-white rounded-lg">
                    <thead className="bg-orange-300">
                      <tr>
                        <th className="border px-4 py-2 text-center">
                          Slot Number
                        </th>
                        <th className="px-4 py-2 border">Doctor's Name</th>

                        <th className="border px-4 py-2 text-center">
                          Time Slot
                        </th>
                        <th className="border px-4 py-2 text-center">
                          Seats Left
                        </th>
                        <th className="border px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((slot, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {doctorDetails.map((doctor) =>
                              doctor._id === slot.doctorID ? doctor.name : null
                            )}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {slot.startTime} - {slot.endTime}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {slot.capacity}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            <button
                              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded"
                              onClick={() => handleBookAppointment(slot._id)}
                            >
                              Book
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <h1>All slots for today have ended.</h1>
              )}
            </div>
          </div>

          <ToastContainer />
        </div>
      </div>
      <footer className="bg-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Hospital Name. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default BookAppointment;
