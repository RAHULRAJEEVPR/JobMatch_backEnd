const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
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
    location: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    imageId: {
      type: String,
    },
    about: {
      type: String,
      default: "No about added",
      required: true,
    },
    phone: {
      type: Number,
    },
    isGoogle: {
      type: Boolean,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    workExp: [
      {
        role: {
          type: String,
        },
        company: {
          type: String,
        },

        exp: {
          type: String,
        },
      },
    ],
    skills: {
      type: Array,
      items: {
        type: String,
      },
    },
    education: [
      {
        course: {
          type: String,
        },
        institute: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
