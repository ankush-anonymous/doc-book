const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: [true, "Please provide correct phone number"],
    minlength: 10,
    maxlength: 13,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  dateOfBirth: {
    type: String, // Accept date as a string
    required: [true, "Please provide date of birth"],
    validate: {
      validator: function (value) {
        // Validate YYYY-MM-DD format
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      },
      message: "Invalid date format. Please use YYYY-MM-DD format.",
    },
  },
  bloodGroup: {
    type: String,
    required: [true, "Please provide blood group"],
  },
  address: {
    type: String,
    required: [true, "Please provide address"],
  },
});

EmployeeSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

EmployeeSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

EmployeeSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Employee", EmployeeSchema);
