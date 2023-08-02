const mongoose = require("mongoose");

const empSchema = new mongoose.Schema(
  {
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
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    imageId: {
      type: String,
    },
    about: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    postCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const empModel = mongoose.model("employers", empSchema);

module.exports = empModel;
