const adminModel = require("../model/adminModel");
const userModel = require("../model/userModel");
const empModel = require("../model/empModel");
const skillsModel = require("../model/skillModel");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminData = await adminModel.findOne({ email: "admin@gmail.com" });

    if (!adminData) {
      return res.status(404).json({ message: "invalid email", login: false });
    }

    if (password !== adminData.password) {
      return res
        .status(401)
        .json({ message: "invalid password", login: false });
    }
    const token = jwt.sign({ id: adminData._id }, process.env.JWT_SECRET, {
      expiresIn: 300000,
    });
    res
      .status(200)
      .json({ login: true, message: "login succesfull", token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, login: false });
  }
};
const userDetails = async (req, res) => {
  try {
    const userData = await userModel.find({});
    if (userData) {
      res.status(200).json({ data: true, message: " succesfull", userData });
    } else {
      res
        .status(400)
        .json({ error: error.message, messsage: "data not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, login: false });

    console.log(error.message);
  }
};
const empDetails = async (req, res) => {
  try {
    const empData = await empModel.find({});
    if (empData) {
      res.status(200).json({ data: true, message: " succesfull", empData });
    } else {
      res
        .status(400)
        .json({ error: error.message, messsage: "data not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, login: false });

    console.log(error.message);
  }
};

const adminAuth = async (req, res) => {
  try {
    const adminData = await adminModel.findOne({ _id: req.adminId });
    if (!adminData) {
      return res
        .status(404)
        .json({ message: "authentication failed", success: false });
    } else {
      return res.status(200).json({ success: true, adminData: adminData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};
const changeUserStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    console.log(status);
    const update = await userModel.updateOne(
      { _id: id },
      { $set: { status: status } }
    );
    if (update) {
      const userData = await userModel.find({});
      if (userData) {
        res.status(200).json({ message: "updated", userData });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};
const changeEmpStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    console.log(status);
    const update = await empModel.updateOne(
      { _id: id },
      { $set: { status: status } }
    );
    if (update) {
      const empData = await empModel.find({});
      if (empData) {
        res.status(200).json({ message: "updated", empData });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};
const userCount = async (req, res) => {
  try {
    const count = await userModel.countDocuments({});
    res.json({ count, message: "user count obtained" }); // Sending the count as JSON response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const empCount = async (req, res) => {
  try {
    const count = await empModel.countDocuments({});
    res.json({ count, message: "emp count obtained" }); // Sending the count as JSON response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const revenue = async (req, res) => {
  try {
    const count = await empModel.countDocuments({
      isPremium: true,
    });
    res.json({ revenue:count*1000, message: "revenue count obtained" }); // Sending the count as JSON response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  adminLogin,
  userDetails,
  empDetails,
  changeEmpStatus,
  adminAuth,
  changeUserStatus,
  userCount,
  empCount,
  revenue
};
