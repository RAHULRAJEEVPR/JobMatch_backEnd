const skillsModel = require("../model/skillModel");

const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    console.log(skill);
    const regex = new RegExp(skill, "i");

    let exists = await skillsModel.findOne({ skill: regex });
    if (exists) {
      return res
        .status(409)
        .json({ error: true, message: "skill already exists" });
    }
    const newSkill = new skillsModel({
      skill: skill,
    });
    let done = await newSkill.save();
    if (done) {
      res.status(200).json({ success: true, message: "added successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const skillDetails = async (req, res) => {
  try {
    const skillData = await skillsModel.find({});
    if (skillData) {
     
      res.status(200).json({ data: true, message: " succesfull", skillData });
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
const dropSkill = async (req, res) => {
  try {
    const { id } = req.body;
    let droped = await skillsModel.deleteOne({ _id: id });
    if (droped) {
      return res
        .status(200)
        .json({ droped: true, message: " Droped successfully" });
    } else {
      res
        .status(500)
        .json({
          error: error.message,
          message: "something went wrong",
          droped: false,
        });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, droped: false });
  }
};


module.exports = {
  addSkill,
  skillDetails,
  dropSkill,
};
