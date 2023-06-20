const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenModel = require("../model/token");
const sendMail = require("../utils/nodeMailer");
const crypto = require("crypto");

const userRegister = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    const exists = await userModel.findOne({ email: email });
    if (exists) {
      return res
        .status(200)
        .json({ exists: true, message: "email already exists" });
    } else {
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;

    const newUser = new userModel({
      name: name,
      email: email,
      password: password,
    });
    let user = await newUser.save().then(console.log("updated"));

    const token = await new tokenModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
    await sendMail(user.email, "verify Email", url);
    res.status(201).json({
      userId: newUser._id,
      created: true,
      message: "An email sent to you account please verify",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, created: false });
  }
};

const verification = async (req, res) => {
  try {
    console.log("chakka");
    const user = await userModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ message: "invalid link" });
    }
    const token = await tokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).json({ message: "invalid Link" });
    }
    await userModel.updateOne({ _id: user._id }, { $set: { verified: true } });
    await tokenModel.deleteOne({ _id: token._id });
    res.status(200).json({ message: "email verified successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};

const userGoogleRegister = async (req, res) => {
  try {
    let { name, email, id, picture } = req.body;

    const exists = await userModel.findOne({ email: email });
    if (exists) {
      return res
        .status(200)
        .json({ exists: true, message: "email already exists" });
    } else {
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(id, salt);
    let password = hashedPassword;

    const newUser = new userModel({
      name: name,
      email: email,
      password: password,
      image: picture,
      verified: true,
    });

    await newUser.save().then(console.log("updated"));
    res.status(201).json({
      userId: newUser._id,
      created: true,
      message: "registration succesfull",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, created: false });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const userData = await userModel.findOne({ email: email });
    console.log("vanno1");
    if (!userData) {
      return res.status(404).json({ message: "invalid email", login: false });
    }
    console.log(userData);

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "invalid passowrd", login: false });
    } else if (!userData.verified) {
      res.status(401).json({
        login: false,
        message:
          "please verify your mail by clicking the link sent to your mail",
        login: false,
      });
    } else {
      const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
        expiresIn: 300000,
      });
      res
        .status(200)
        .json({ login: true, message: "login successful", token: token });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, login: false });
  }
};
const userGoogleLogin = async (req, res) => {
  try {
    const { email, id } = req.body;
    console.log(email);
    const userData = await userModel.findOne({ email: email });
    console.log("google vanno");
    if (!userData) {
      return res.status(404).json({ message: "invalid email", login: false });
    }
    console.log(userData);
    const isMatch = await bcrypt.compare(id, userData.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "invalid passowrd", login: false });
    } else {
      const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
        expiresIn: 300000,
      });
      res
        .status(200)
        .json({ login: true, message: "login successful", token: token });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, login: false });
  }
};
const userDetails = async (req, res) => {
  try {
    console.log("vanno");
    const userData = await userModel.findOne({ _id: req.userId });
    if (!userData) {
      return res
        .status(200)
        .json({ message: "user does not exists", success: false });
    } else {
      return res.status(200).json({ success: true, userData: userData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userDetails,
  userGoogleRegister,
  userGoogleLogin,
  verification,
};
