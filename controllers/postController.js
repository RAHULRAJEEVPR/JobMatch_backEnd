const postModel = require("../model/postModel");
const { uploadToCloudinary } = require("../config/cloudinary");
const sendMail = require("../utils/nodeMailer");
const userModal = require("../model/userModel");
const empModal = require("../model/empModel");
const reportModal=require("../model/reportsModal")
require("dotenv").config();


// empoyer apis

//employer createing a new job offer
const createPost = async (req, res) => {
  try {
    const {
      role,
      location,
      jobType,
      ctc,
      exp,
      vacancy,
      description,
      skills,
      additionalSkills,
    } = req.body;

    const newPost = new postModel({
      role,
      empId: req.empId,
      location,
      jobtype: jobType,
      ctc,
      minimumExp: exp,
      vacancy: vacancy,
      skills: skills,
      additionalSkills: additionalSkills,
      jobDescription: description,
    });
    let post = await newPost.save();
    

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "something went wrong" });
    }
    const update = await empModal.findOneAndUpdate(
      { _id: req.empId },
      { $inc: { postCount: 1 } },{ new: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "created successfully",empData:update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const {
      id,
      role,
      location,
      jobType,
      ctc,
      exp,
      vacancy,
      description,
      skills,
      additionalSkills,
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: true, message: "Post ID is required" });
    }

    // Find the post by ID
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ error: true, message: "Post not found" });
    }

    // Update the post fields
    post.role = role;
    post.location = location;
    post.jobtype = jobType;
    post.ctc = ctc;
    post.minimumExp = exp;
    post.vacancy = vacancy;
    post.skills = skills;
    post.additionalSkills = additionalSkills;
    post.jobDescription = description;

    await post.save();

    let empId = req.empId;
    let postData = await postModel.find({ empId: empId, }).populate("empId");
    if (postData) {
      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        postData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const postId = req.body.id;

    const deleted = await postModel.findOneAndDelete({ _id: postId });
    if (!deleted) {
      return res.status(404).json({ error: true, message: "Post not found" });
    }
    let id = req.empId;
    let postData = await postModel.find({ empId: id , }).populate("empId");
    if (postData) {
      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        postData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};
const completePost = async (req, res) => {
  try {
    const postId = req.body.id;

    const completed = await postModel.updateOne(
      { _id: postId },
      { $set: { status: "Completed" } }
    );
    if (!completed) {
      return res.status(404).json({ error: true, message: "Post not found" });
    }
    let id = req.empId;
    let postData = await postModel.find({ empId: id  }).populate("empId");
    if (postData) {
      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        postData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

//employer all active post data
const getPostData = async (req, res) => {
  try {
    let id = req.empId;
    let postData = await postModel.find({ empId: id }).populate("empId");

    if (postData) {
      res.status(200).json({ data: true, message: "data obtained", postData });
    } else {
      res.status(200).json({ data: false, message: "no post found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};
const getActivePostData = async (req, res) => {
  try {
    let id = req.empId;
    let postData = await postModel
      .find({ empId: id, status: "Active" })
      .populate("empId");

    if (postData) {
      res.status(200).json({ data: true, message: "data obtained", postData });
    } else {
      res.status(200).json({ data: false, message: "no post found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

//user apis

const userGetAllPosts = async (req, res) => {
  try {
    let postData = await postModel.find({ status: "Active",block:{$ne:true} }).populate("empId");

    if (postData) {
      res.status(200).json({ data: true, message: "data obtained", postData });
    } else {
      res.status(404).json({ data: false, message: "no post found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const singleJobDetails = async (req, res) => {
  try {
    console.log("aaa");
    const id = req.params.id;
    console.log(id, "haii");
    let postData = await postModel.findOne({ _id: id }).populate("empId");

    if (postData) {
      res.status(200).json({ data: true, message: "data obtained", postData });
    } else {
      res.status(404).json({ data: false, message: "no post found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const applyJob = async (req, res) => {
  try {
    const resume = req.file.path;
    const { postId, coverLetter } = req.body;

    let post = await postModel.findOne({ _id: postId });
    if (post) {
      const existingApplicant = post.applicants.find(
        (applicant) => applicant.applicant.toString() === req.userId
      );
      if (existingApplicant) {
        return res
          .status(400)
          .json({ success: true, message: "Alredy Applied" });
      }
    }
    const data = await uploadToCloudinary(resume, "resumes");
   console.log(data)
    const newapplicant = {
      applicant: req.userId,
      status: "Pending",
      coverLetter: coverLetter,
      resumeUrl: data.url,
      resumePublicId: data.public_id,
    };

    post.applicants.push(newapplicant);
    await post.save();

    return res
      .status(200)
      .json({ success: true, message: "Applyed successfully", post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "something went wrong", post });
  }
};

const getSinglePostData = async (req, res) => {
  try {
    let postId = req.params.postId;
    console.log(postId);
    const postData = await postModel
      .findOne({ _id: postId })
      .populate("applicants.applicant");
    if (postData) {
      return res
        .status(200)
        .json({ success: true, message: "data obtained", postData });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "data not found" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};
const changeApplicationStatus = async (req, res) => {
  try {
    const { postId, applicationId, newStatus, userId } = req.params;
    console.log(userId, "id");

    let postData = await postModel
      .findOneAndUpdate(
        { _id: postId, "applicants._id": applicationId },
        { $set: { "applicants.$.status": newStatus } },
        { new: true }
      )
      .populate("applicants.applicant")
      .populate("empId");
    if (!postData) {
      return res
        .status(404)
        .json({ success: false, message: "post not found" });
    }
    const userData = await userModal.findOne({ _id: userId });
    let message = "";
    if (newStatus == "Selected") {
      message = `Congratulations  on your selection! We are thrilled to inform you that your application for the ${postData.role} position has been chosen by ${postData.empId.cmpName}.
       Your skills and experience stood out among the applicants, and we believe you will be a valuable addition to our team.
         Welcome aboard!`;
    } else if (newStatus == "Rejected") {
      message = `We regret to inform you that your job application for the ${postData.role} position has been rejected by ${postData.empId.cmpName}.
        We appreciate your interest in our company and wish you the best in your future endeavors.`;
    }
    await sendMail(userData.email, "Application Status", message);

    return res
      .status(200)
      .json({ success: true, message: "updated successfully", postData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

const userApplications = async (req, res) => {
  try {
    const userId = req.userId;
    const status = req.params.status;
    const postData = await postModel
      .find({
        applicants: {
          $elemMatch: {
            applicant: userId,
            status: status,
          },
        },
      })
      .populate("empId");
    if (postData) {
      res.status(200).json({ success: true, postData });
    } else {
      res.status(200).json({ success: true, postData: [{}] });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};
const empUserInvite = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, postId } = req.body;
    const postData = await postModel.findOne({ _id: postId });
    const alreadyInvited = postData.invites.some(
      (invite) => invite.userId.toString() === userId
    );
    if (alreadyInvited) {
      return res
        .status(200)
        .json({ success: false, message: "User already invited", postData });
    }
    const newUser = {
      userId: userId,
    };
    postData.invites.push(newUser);
    await postData.save();
    console.log(postData);
    return res
      .status(200)
      .json({ succes: true, message: "invited successfully", postData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};
const InvitedJobs = async (req, res) => {
  try {
    const userId = req.userId;
    const postData = await postModel
      .find({ "invites.userId": userId })
      .populate("empId");
    if (postData) {
      return res.status(200).json({ success: true, postData });
    } else {
      return res.status(200).json({ success: true, postDat: [] });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error, message: "internal server error" });
  }
};
const adminGetAllPostData=async(req,res)=>{
  try {
    let postData = await postModel.find({ status: "Active" }).populate("empId");

    if (postData) {
      res.status(200).json({ data: true, message: "data obtained", postData });
    } else {
      res.status(404).json({ data: false, message: "no post found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  } 
}
const reportJob=async(req,res)=>{
  try {
    const {reason,postId}=req.body

    const alreadyReported=await reportModal.findOne({postId:postId,reportedBy:req.userId})
    if(alreadyReported){
      return res.status(200).json({reported:false,message:"you have already reported this post"})
    }
 const report=new reportModal({
  postId,
  reportedBy:req.userId,
  reason
 })
 const reported=await report.save()
 if(reported){
 return res.status(200).json({reported:true,message:"Reported successfully"})
 }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
}

const adminGetReportedPosts = async (req, res) => {
  try {
    
    const reportedPosts = await reportModal.find({})
      .populate("postId")
      .populate("reportedBy")
      .populate({ path: "postId", populate: { path: "empId" } });
 
   

    res.status(200).json({ message: "data obtained", reportedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const changePostStatus = async (req, res) => {
  try {
    
    console.log(req.body,"");
    const {id,status}=req.body
    const update=await postModel.updateOne({_id:id},{$set:{block:status}})
if(update){

  const reportedPosts = await reportModal.find({})
    .populate("postId")
    .populate("reportedBy")
    .populate({ path: "postId", populate: { path: "empId" } });

 

  res.status(200).json({ message: "data obtained", reportedPosts });
}
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createPost,
  getPostData,
  userGetAllPosts,
  singleJobDetails,
  applyJob,
  editPost,
  deletePost,
  getSinglePostData,
  changeApplicationStatus,
  completePost,
  userApplications,
  getActivePostData,
  empUserInvite,
  InvitedJobs,
  adminGetAllPostData,
  reportJob,
  adminGetReportedPosts,
  changePostStatus
};
