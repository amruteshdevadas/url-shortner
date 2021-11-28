var express = require("express");
var router = express.Router();
var User = require("../models/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
var sendEmail = require("../utils/SendEmail");


exports.postUser = async (req, res) => {
  let { userData } = req.body;

  let hashPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashPassword;
  let user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    _id: userData.email,
    password: userData.password,
  });
  try {
    await user.save();
    res.json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.json({ message: "User not created" });
  }
};

exports.postLogin = async (req, res) => {
  let {userData} = req.body;
  let user = await User.findOne({ _id: userData.email });
  if (!user) {
    res.json({ message: "User not found" });
  } else {
    let passwordIsValid = await bcrypt.compare(userData.password, user.password);
    if (!passwordIsValid) {
      res.json({ message: "Invalid Password" });
    } else {
      let token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_SECRET}`);
      res.json({ token: token ,message: "Login Successful" });
    }
  }
};

exports.putForgotPassword = async (req, res) => {
  let { email } = req.body;
  let user = await User.findOne({ _id: email });
  if (!user) {
    res.json({ message: "User not found" });
  } else {
    try {
      let token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_SECRET}`);

      await User.updateOne(
        { _id: email },
        {
          $set: {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000,
          },
        }
      );

      const link = `${process.env.BASE_URL}/users/password-reset/${user._id}/${token}`;
      await sendEmail(user._id, "Password reset", link);
      res.json({ message: "Email sent" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went Wrong" });
    }
  }
};
exports.putResetPassword = async (req, res) => {
  let { id } = req.params;
  let {password} = req.body;

  let token = req.params.token;
  if (token) {
    let user = await User.findOne({ _id: id });
    if (!user) {
      res.json({ message: "User not found" });
    } else {
      let hashPassword = await bcrypt.hash(password, 10);

      try {
        await User.updateOne(
          { _id: id },
          { $set: { password: hashPassword, resetPasswordToken: null } }
        );
        res.json({ message: "Password updated" });
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    res.json({ message: "Invalid Token" });
  }
};

