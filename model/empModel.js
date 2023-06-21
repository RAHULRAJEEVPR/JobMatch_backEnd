const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
  cmpName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
});

const empModel = mongoose.model("employers", empSchema );

module.exports = empModel;
