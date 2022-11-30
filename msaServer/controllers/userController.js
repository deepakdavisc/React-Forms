const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
// @desc Get User
// @route GET /api/user
// access Public
const getUser = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// @desc Create User
// @route POST /api/user
// access Public
const createUser = asyncHandler(async (req, res) => {
  //   console.log(req.body);
  const { email, name, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please add all required fields");
  }

  // check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.send(400);
    throw new Error("User exists");
  }

  // create password hash
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  const user = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: hashedPwd,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("error in create a user");
  }

  //   res.status(200).json(users);
});

// @desc Auth User
// @route POST /api/user/login
// access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Login failed... please try again later");
  }

  res.send(`Auth User`);
});

// @desc Get Current User
// @route GET /api/user/me
// access Public
const geCurrentUser = asyncHandler(async (req, res) => {
  //   console.log(req.user.id);

  const { _id, name, email } = await User.findById(req.user.id);

  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

// @desc Update User
// @route PUT /api/user
// access Public
const updateUser = asyncHandler(async (req, res) => {
  res.send(`update user ${req.params.id}`);
});

// @desc Delete User
// @route Delete /api/user
// access Public
const deleteUser = asyncHandler(async (req, res) => {
  res.send(`delete user ${req.params.id}`);
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_TOEKN, { expiresIn: "30d" });
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  authUser,
  geCurrentUser,
};
