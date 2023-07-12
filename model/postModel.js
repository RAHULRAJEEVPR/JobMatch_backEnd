const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
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
  additionalSkills:{
    type:Array,
    required:true,
    default:[]
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
        default:"pending"
      },
      coverLetter:{
        type:String,
        required:true
      },
      resumeUrl:{
        type:String,
        required:true
      },
      resumePublicId:{
        type:String,
        required:true
      }
    },
  ],
  status: {
    type: String,
    default: "active",
  },
  vacancy: {
    type: Number,
    required: true,
  },
});

const postModel=mongoose.model("posts",postSchema)

module.exports =postModel;
