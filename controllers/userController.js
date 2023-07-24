const userModel = require("../model/userModel");
const empModal = require("../model/empModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenModel = require("../model/token");
const sendMail = require("../utils/nodeMailer");
const crypto = require("crypto");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../config/cloudinary");

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
    let user = await newUser.save();

    const token = await new tokenModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    console.log(token,"tokennn");
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
    console.log("verfiy");
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
      isGoogle: true,
    });

    await newUser.save();
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

    const userData = await userModel.findOne({ email: email });

    if (!userData) {
      return res.status(404).json({ message: "invalid email", login: false });
    }

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
        expiresIn: 3000000,
      });
      res.status(200).json({
        login: true,
        message: "login successful",
        token: token,
        userData,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, login: false });
  }
};
const userGoogleLogin = async (req, res) => {
  try {
    const { email, id } = req.body;

    const userData = await userModel.findOne({ email: email });

    if (!userData) {
      return res.status(404).json({ message: "invalid email", login: false });
    }

    const isMatch = await bcrypt.compare(id, userData.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "invalid passowrd", login: false });
    } else {
      const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
        expiresIn: 300000,
      });
      res.status(200).json({
        login: true,
        message: "login successful",
        token: token,
        userData,
      });
    }
  } catch (error) {
    console.log(error.message );
    res.status(500).json({ error: error.message, login: false });
  }
};
const isUserAuth = async (req, res) => {
  try {
    const userData = await userModel.findOne({ _id: req.userId });
    if (!userData) {
      return res
        .status(404)
        .json({ message: "user does not exists", success: false });
    } else {
      return res.status(200).json({ success: true, userData: userData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
};

const updateUserAbout = async (req, res) => {
  try {
    const { about } = req.body;
    let userData = await userModel.findOneAndUpdate(
      { _id: req.userId },
      { $set: { about: about } },
      { new: true }
    );

    return res.status(200).json({ success: true, userData: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
const addUserExp = async (req, res) => {
  try {
    const { exp, role, company } = req.body;

    let userData = await userModel.findOne({ _id: req.userId });
    const newExp = {
      role: role,
      company: company,
      exp: exp,
    };

    userData.workExp.push(newExp);
    await userData.save();

    return res.status(200).json({ success: true, userData: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
const addUserSkill = async (req, res) => {
  try {
    const skill = req.body;

    let userData = await userModel.findOne({ _id: req.userId });
    const newSkills = skill.filter((skill) => !userData.skills.includes(skill));
    userData.skills.push(...skill);
    await userData.save();

    return res.status(200).json({ success: true, userData: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const dropUserSkill = async (req, res) => {
  try {
    let { skill } = req.body;
    const userId = req.userId;

    const userData = await userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { skills: skill } },
      { new: true }
    );

    return res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const addUserEdu = async (req, res) => {
  try {
    const { course, Institute } = req.body;

    let userData = await userModel.findOne({ _id: req.userId });
    const newEdu = {
      course: course,
      institute: Institute,
    };

    userData.education.push(newEdu);
    await userData.save();

    return res.status(200).json({ success: true, userData: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const dropUserExp = async (req, res) => {
  try {
    let { id } = req.body;
    const userId = req.userId;

    const userData = await userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { workExp: { _id: id } } },
      { new: true }
    );

    return res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
const dropUserEdu = async (req, res) => {
  try {
    let { id } = req.body;
    const userId = req.userId;

    const userData = await userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { education: { _id: id } } },
      { new: true }
    );

    return res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const updateUserBasicInfo = async (req, res) => {
  try {
    const { Location, Phone, name } = req.body;

    const userId = req.userId;

    const userData = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { location: Location, phone: Phone, name: name } },
      { new: true }
    );

    return res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currPass, newPass } = req.body;
    const userData = await userModel.findOne({ _id: req.userId });

    const isMatch = await bcrypt.compare(currPass, userData.password);
    if (isMatch) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPass, salt);
      await userModel
        .updateOne({ _id: req.userId }, { $set: { password: hashedPassword } })
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Password Changed Successfully" });
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const changeUserImg = async (req, res) => {
  try {
    console.log("vanno");
    const userId = req.userId;

    const image = req.file.path;
    let user = await userModel.findOne({ _id: userId });

    if (user.imageId) {
      const responseData = await removeFromCloudinary(user.imageId);
    }
    const data = await uploadToCloudinary(image, "profilePictures");
console.log(data);
    if (data) {
      const userData = await userModel.findOneAndUpdate(
        { _id: userId },
        { $set: { image: data.url, imageId: data.public_id } },
        { new: true }
      );
      return res.status(200).json({ success: true, userData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const userGetEmpDetails = async (req, res) => {
  try {
    let empId = req.params.empId;
    const empData = await empModal.findOne({ _id: empId });
    if (!empData)
      return res
        .status(404)
        .json({ success: false, message: "not data found" });

    return res
      .status(200)
      .json({ success: true, message: "data obtained", empData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  isUserAuth,
  userGoogleRegister,
  userGoogleLogin,
  verification,
  updateUserAbout,
  addUserExp,
  addUserSkill,
  dropUserSkill,
  addUserEdu,
  dropUserExp,
  dropUserEdu,
  updateUserBasicInfo,
  changePassword,
  changeUserImg,
  userGetEmpDetails,
};
