const User = require("../models/UserSchema");
const Slots = require("../models/SlotsSchema");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const getAllUser = async (req, res) => {
  const { _id, name, age, phoneNumber } = req.query;
  const queryObject = {};

  if (_id) {
    queryObject._id = _id;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (age) {
    queryObject.age = age;
  }
  if (phoneNumber) {
    queryObject.phoneNumber = phoneNumber;
  }

  const user = await User.find(queryObject);
  res.status(StatusCodes.OK).json({ user, count: user.length });
};

const deleteUser = async (req, res) => {
  const {
    params: { id: UserId },
  } = req;
  const user = await User.findByIdAndRemove({ _id: UserId });
  if (!user) {
    throw new NotFoundError(`No job with id ${UserId}`);
  }
  res.status(StatusCodes.OK).send("user deleted");
};

module.exports = { getAllUser, deleteUser };
