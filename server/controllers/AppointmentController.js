const Appointment = require("../models/BookingsSchema");
const Slot = require("../models/SlotsSchema");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllSlots = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Tomorrow's date
    tomorrow.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const slots = await Slot.find({
      date: { $gte: today, $lt: tomorrow },
    });

    res.status(StatusCodes.OK).json({ slots, count: slots.length });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while fetching slots.",
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { userPhone, slotId, doctorId } = req.body;

    // Create appointment
    const appointment = await Appointment.create({
      userPhone,
      slotId,
      doctorId,
    });

    res.status(StatusCodes.CREATED).json({ appointment });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server error" });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { date, userPhone, status } = req.query;
    const queryObject = {};

    if (date) {
      // Check if the date parameter has a 'T' character, indicating time
      if (date.includes("T")) {
        queryObject.date = date;
      } else {
        // If the date parameter doesn't include 'T', add a time range to fetch appointments for the entire day
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        queryObject.date = {
          $gte: startDate.toISOString(),
          $lt: endDate.toISOString(),
        };
      }
    }

    if (userPhone) {
      queryObject.userPhone = userPhone;
    }
    if (status) {
      queryObject.status = status;
    }

    const appointments = await Appointment.find(queryObject);
    res
      .status(StatusCodes.OK)
      .json({ appointments, count: appointments.length });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while fetching appointments",
    });
  }
};

const getAllTodayAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Tomorrow's date
    tomorrow.setHours(0, 0, 0, 0); // Set time to 00:00:00

    const { userPhone, status } = req.query;
    const queryObject = {
      date: { $gte: today, $lt: tomorrow },
    };

    if (userPhone) {
      queryObject.userPhone = userPhone;
    }

    const appointments = await Appointment.find(queryObject);
    res
      .status(StatusCodes.OK)
      .json({ appointments, count: appointments.length });
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while fetching today's appointments",
    });
  }
};

const getAppointment = async (req, res) => {
  const {
    params: { id: appId },
  } = req;
  const appointment = await Appointment.findOne({ _id: appId });
  if (!appointment) {
    throw new NotFoundError(`No appointment with id ${slotId}`);
  }
  res.status(StatusCodes.OK).json({ appointment });
};

const updateAppointment = async (req, res) => {
  const {
    body: { userPhone, slotId, date, isChecked },
    params: { id: appId },
  } = req;

  if (userPhone === "" || slotId === "" || date === "" || isChecked === "") {
    throw new BadRequestError("fields cannot be empty");
  }
  const appointment = await Appointment.findByIdAndUpdate(
    { _id: appId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!appointment) {
    throw new NotFoundError(`No job with id ${appId}`);
  }
  res.status(StatusCodes.OK).json({ appointment });
};

const deleteAppointment = async (req, res) => {
  const {
    params: { id: appId },
  } = req;
  const appointment = await Appointment.findByIdAndDelete(appId);
  if (!appointment) {
    throw new NotFoundError(`No appointment with id ${appId}`);
  }

  res.status(StatusCodes.OK).send("Appointment deleted successfully");
};

const clearAppointments = async (req, res) => {
  try {
    await Appointment.deleteMany({});
    res.status(StatusCodes.OK).send("Appointments deleted successfully");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while clearing appointments." });
  }
};

module.exports = {
  getAllSlots,
  getAllAppointments,
  getAllTodayAppointments,
  createAppointment,
  getAppointment,
  deleteAppointment,
  updateAppointment,
  clearAppointments,
};
