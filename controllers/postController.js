const postModel = require("../model/postModel");
const { uploadToCloudinary } = require("../config/cloudinary");

// empoyer apis

//employer createing a new job offer
const createPost = async (req, res) => {
  try {
    console.log(req.body);
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
    let post = await newPost
      .save()
      .then(console.log("new post created"))
      .catch((err) => console.log(err));
    if (post) {
      res.status(200).json({ success: true, message: "created successfully" });
    }
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

    // Retrieve the post ID from the request parameters or body

    // Check if the post ID is provided
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

    // Save the updated post
    await post.save();

    let empId = req.empId;
    let postData = await postModel.find({ empId: empId }).populate("empId");
    if(postData){
      return res
      .status(200)
      .json({ success: true, message: "Post updated successfully",postData });
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
    let postData = await postModel.find({ empId: id }).populate("empId");
    if(postData){
      return res
      .status(200)
      .json({ success: true, message: "Post updated successfully",postData });
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

//user apis

const userGetAllPosts = async (req, res) => {
  try {
    let postData = await postModel.find({}).populate("empId");

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
    const id = req.params.id;
    console.log("vannnue", id);
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
    const newapplicant = {
      applicant: req.userId,
      status: "pending",
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

module.exports = {
  createPost,
  getPostData,
  userGetAllPosts,
  singleJobDetails,
  applyJob,
  editPost,
  deletePost,
};
