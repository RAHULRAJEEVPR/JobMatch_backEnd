const empModel =require("../model/empModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenModel = require("../model/token");
const sendMail = require("../utils/nodeMailer");
const crypto = require("crypto");

const empRegister = async (req, res) => {
    try {
        console.log("varunindo");
      let { cmpName, email, password } = req.body;
  
      const exists = await empModel.findOne({ email: email });
      if (exists) {
        return res
          .status(200)
          .json({ exists: true, message: "email already exists" });
      } else {
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      password = hashedPassword;
  
      const newEmp = new empModel({
        cmpName:cmpName,
        email: email,
        password: password,
      });
      let emp = await newEmp.save().then(console.log("updated"));
  
      const token = await new tokenModel({
        userId: emp._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}employer/${emp._id}/verify/${token.token}`;
      await sendMail(emp .email, "verify Email", url);
      res.status(201).json({
        userId: emp._id,
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
      
      const user = await empModel.findOne({ _id: req.params.id });
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
      await empModel.updateOne({ _id: user._id }, { $set: { verified: true } });
      await tokenModel.deleteOne({ _id: token._id });
      res.status(200).json({ message: "email verified successfully" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "internal server error" });
    }
  };
  
  
  const empGoogleRegister = async (req, res) => {
    try {
      
      let { name, email, id, picture } = req.body;
  
      const exists = await empModel.findOne({ email: email });
      if (exists) {
        console.log(exists);
        return res
          .status(200)
          .json({ exists: true, message: "email already exists" });
      } else {
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(id, salt);
      let password = hashedPassword;
  
      const newUser = new empModel({
        cmpName: name,
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
  const empLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email);
      const empData = await empModel.findOne({ email: email });
      console.log("vanno1");
      if (!empData) {
        return res.status(404).json({ message: "invalid email", login: false });
      }
      console.log(empData);
  
      const isMatch = await bcrypt.compare(password, empData.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "invalid passowrd", login: false });
      } else if (!empData.verified) {
        res.status(401).json({
          login: false,
          message:
            "please verify your mail by clicking the link sent to your mail",
          login: false,
        });
      } else {
        const token = jwt.sign({ id: empData._id }, process.env.JWT_SECRET, {
          expiresIn: 300000,
        });
        res
          .status(200)
          .json({ login: true, message: "login successful",  });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message, login: false });
    }
  };
  const empGoogleLogin = async (req, res) => {
    try {
      const { email, id } = req.body;
      console.log(email);
      const empData = await empModel.findOne({ email: email });
      console.log("google vanno");
      if (!empData) {
        return res.status(404).json({ message: "invalid email", login: false });
      }
      console.log(empData);
      const isMatch = await bcrypt.compare(id, empData.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "invalid passowrd", login: false });
      } else {
        const token = jwt.sign({ id: empData._id }, process.env.JWT_SECRET, {
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


  
  module.exports={
    empRegister,
    verification,
    empGoogleRegister,
    empGoogleLogin,
    empLogin
  }