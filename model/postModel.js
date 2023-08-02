const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobtype: {
      type: String,
      required: true,
    },
    ctc: {
      type: Number,
      required: true,
    },
    minimumExp: {
      type: Number,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    skills: {
      type: Array,
      required: true,
    },
    additionalSkills: {
      type: Array,
      required: true,
      default: [],
    },
    empId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employers",
      required: true,
    },
    applicants: [
      {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        status: {
          type: String,
          required: true,
          default: "pending",
        },
        coverLetter: {
          type: String,
          required: true,
        },
        resumeUrl: {
          type: String,
          required: true,
        },
        resumePublicId: {
          type: String,
          required: true,
        },
      },
    ],
    invites: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
      },
    ],
    status: {
      type: String,
      default: "Active",
    },
    vacancy: {
      type: Number,
      required: true,
    },
    block: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;
