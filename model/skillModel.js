const mongoose = require("mongoose");
const skillsSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const skillsModel = mongoose.model("skills", skillsSchema);
module.exports = skillsModel;
