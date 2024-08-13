const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema({
  phoneNumber: {
    type: Number,
    required: [true, "Please provide correct phone number"],
    minlength: 10,
    maxlength: 13,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  isDoctorSec: {
    type: Boolean,
    default: false,
  },
  selectedDoctorPhoneNumber: {
    type: Number, // You can adjust the type based on your needs (e.g., String for phone numbers)
  },
});

// Add a pre-update middleware
rolesSchema.pre("updateOne", function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

const RolesSchema = mongoose.model("RolesSchema", rolesSchema);

module.exports = RolesSchema;
