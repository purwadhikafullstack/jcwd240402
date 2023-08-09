const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../../models");

const register = async (req, res) => {
  res.json("register");
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      phone,
      password,
      confirm_password,
    } = req.body;
    if (password !== confirm_password)
      return res.status(400).json({
        ok: false,
        message: "password and confirm password have to match",
      });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
  } catch (error) {}
};

const login = (req, res) => {
  res.json("login");
};

const keepLogin = (req, res) => {
  res.json("keepLogin");
};

const verifyAccount = (req, res) => {
  res.json("verifyAccount");
};

const resendVerifyAccount = (req, res) => {
  res.json("resendVerifyAccount");
};

const forgotPassword = (req, res) => {
  res.json("forgotPassword");
};

const resetPassword = (req, res) => {
  res.json("resetPassword");
};

const closeAccount = (req, res) => {
  res.json("deleteAccount");
};

module.exports = {
  register,
  login,
  keepLogin,
  verifyAccount,
  resendVerifyAccount,
  forgotPassword,
  resetPassword,
  closeAccount,
};
