const empModel = require("../model/empModel");
const userModel = require("../model/userModel");
const subscriptionModal = require("../model/subscriptionModal");
const tokenModel = require("../model/token");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/nodeMailer");
const jwt = require("jsonwebtoken");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../config/cloudinary");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");
const BASE_URL = process.env.BASE_URL;
const PREMIUM_PRICE_INR = 1000 * 100

const empRegister = async (req, res) => {
  try {
    const { cmpName, email, password } = req.body;

    const exists = await empModel.findOne({ email: email });
    if (exists) {
      return res
        .status(200)
        .json({ exists: true, message: "email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newEmp = new empModel({
      cmpName: cmpName,
      email: email,
      password: hashedPassword,
    });
    let emp = await newEmp.save();

    const token = await new tokenModel({
      userId: emp._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}employer/${emp._id}/verify/${token.token}`;
    await sendMail(emp.email, "verify Email", url);

    res.status(201).json({
      userId: emp._id,
      created: true,
      message: "An email sent to your account, please verify",
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

    const empData = await empModel.findOne({ email: email });
    console.log("vanno1");
    if (!empData) {
      return res.status(404).json({ message: "invalid email", login: false });
    }

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
      const token = jwt.sign({ id: empData._id,role:"emp" }, process.env.JWT_SECRET, {
        expiresIn: 300000,
      });
      res
        .status(200)
        .json({ login: true, message: "login successful", empData, token });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, login: false });
  }
};
const empGoogleLogin = async (req, res) => {
  try {
    const { email, id } = req.body;

    const empData = await empModel.findOne({ email: email });

    if (!empData) {
      return res.status(404).json({ message: "invalid email", login: false });
    }

    const isMatch = await bcrypt.compare(id, empData.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "invalid passowrd", login: false });
    } else {
      const token = jwt.sign({ id: empData._id ,role:"emp"}, process.env.JWT_SECRET, {
        expiresIn: 300000,
      });
      res
        .status(200)
        .json({
          login: true,
          message: "login successful",
          token: token,
          empData,
        });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, login: false });
  }
};

const empAuth = async (req, res) => {
  try {
    const empData = await empModel.findOne({ _id: req.empId });
    if (!empData) {
      return res
        .status(404)
        .json({ message: "authentication failed", success: false });
    } else {
      return res.status(200).json({ success: true, empData });
    }
  } catch (error) {}
};

const getUserData = async (req, res) => {
  try {
    let userId = req.params.userId;

    const userData = await userModel.findOne({ _id: userId });
    if (userData) {
      return res
        .status(200)
        .json({ login: true, message: "login successful", userData });
    } else {
      return res
        .status(404)
        .json({ message: "userData not found", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message, success: false });
  }
};

const changeImg = async (req, res) => {
  try {
    const empId = req.empId;

    const image = req.file.path;
    let emp = await empModel.findOne({ _id: empId });
    if (emp.imageId) {
      const responseData = await removeFromCloudinary(emp.imageId);
    }
    const data = await uploadToCloudinary(image, "profilePictures");

    if (data) {
      const empData = await empModel.findOneAndUpdate(
        { _id: empId },
        { $set: { image: data.url, imageId: data.public_id } },
        { new: true }
      );
      return res.status(200).json({ success: true, empData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const updateAbout = async (req, res) => {
  try {
    const { about } = req.body;
    let empid = req.empId;
    const empData = await empModel.findOneAndUpdate(
      { _id: empid },
      { $set: { about: about } },
      { new: true }
    );

    if (empData) {
      return res
        .status(200)
        .json({ success: true, message: "updated", empData });
    }
    return res
      .status(404)
      .json({ success: false, message: "something went wrong" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
const updateBasicInfo = async (req, res) => {
  try {
    const { Location, Phone, name } = req.body;
    const empId = req.empId;
    console.log(name, "name");
    const empData = await empModel.findOneAndUpdate(
      { _id: empId },
      { $set: { location: Location, phone: Phone, cmpName: name } },
      { new: true }
    );
    if (!empData) {
      return res
        .status(404)
        .json({ success: false, message: "something went wrong" });
    }
    return res.status(200).json({ success: true, message: "updated", empData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const empUserSearch = async (req, res) => {
  try {
    const { skill } = req.body;

    if (skill === "") {
      const userData = await userModel.find({});
      if (userData) {
        return res.status(200).json({ success: true, userData });
      } else {
        return res.status(404).json({ success: true, userData: [] });
      }
    } else {
      const userData = await userModel.find({ skills: { $in: [skill] } });
      if (userData) {
        return res.status(200).json({ success: true, userData });
      } else {
        return res.status(200).json({ success: true, userData: [] });
      }
    }
  } catch (error) {
    // Handle error
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const premium = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "JobMatch Premium",
            },
            unit_amount: PREMIUM_PRICE_INR,
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/employer/paymentSuccess/${req.empId}`,
      cancel_url: `${BASE_URL}/employer/subscription`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const updatePremium = async (req, res) => {
  try {
    const { empId } = req.params;
    const empData = await empModel.findOneAndUpdate(
      { _id: empId },
      { $set: { isPremium: true } },
      { new: true }
    );

    if (!empData) {
      return res.status(404).json({ message: "Employer data not found" });
    }

    const orderId = uuidv4();
    const subscription = new subscriptionModal({
      empId: empId,
      amount: 1000,
      pack: "premium",
      orderId: orderId,
    });

    const savedSubscription = await subscription.save();

    if (savedSubscription) {
      return res.status(200).json({ empData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

module.exports = {
  empRegister,
  verification,
  empGoogleRegister,
  empGoogleLogin,
  empLogin,
  getUserData,
  changeImg,
  updateAbout,
  updateBasicInfo,
  empUserSearch,
  premium,
  updatePremium,
  empAuth,
};
