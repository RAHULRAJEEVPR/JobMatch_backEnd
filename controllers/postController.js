const postModel = require("../model/postModel");


// empoyer apis

//employer createing a new job offer
const createPost = async (req, res) => {
  try {
    console.log(req.body);
    const { role, location, jobType, ctc, exp, vacancy, description, skills } =
      req.body;
    const newPost = new postModel({
      role,
      empId: req.empId,
      location,
      jobtype: jobType,
      ctc,
      minimumExp: exp,
      vacancy: vacancy,
      skills: skills,
      jobDescription: description,
    });
    let post = await newPost
      .save()
      .then(console.log("new post created"))
      .catch((err) => console.log(err));
    if (post) {
      res.status(200).json({ success: true, message: "created successfully" })    
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};
//employer all active post data
const getPostData=async(req,res)=>{
  try {
    let id=req.empId
    let postData=await postModel.find({empId:id}).populate("empId")
   
    if (postData) {
      res.status(200).json({ data: true, message: "data obtained",postData })    
    }else{
      res.status(200).json({data:false, message: "no post found",})    
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
}


//user apis

const userGetAllPosts=async(req,res)=>{
  try {
    let postData=await postModel.find({}).populate("empId")
   
    if (postData) {
      res.status(200).json({ data: true, message: "data obtained",postData })    
    }else{
      res.status(404).json({data:false, message: "no post found",})    
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
}

module.exports = {
  createPost,
  getPostData,
  userGetAllPosts
}
