const express = require("express");
const router = express.Router();
const {
  createPost,
  getPostData,
  editPost,
  deletePost,
  getSinglePostData,
  changeApplicationStatus,
  completePost,
  getActivePostData,
  empUserInvite
} = require("../controllers/postController");
const { empAuthentication } = require("../middilewares/empAuth");
const {
  empRegister,
  verification,
  empGoogleRegister,
  empGoogleLogin,
  empLogin,
  getUserData,
  changeImg,
  updateAbout,
  updateBasicInfo,
  empUserSearch
} = require("../controllers/empController");
const { skillDetails } = require("../controllers/skillController");
const { cityDetails } = require("../controllers/cityController");
const upload =require("../middilewares/multer")


router.post("/register", empRegister);
router.get("/:id/verify/:token", verification);
router.post("/googleRegister", empGoogleRegister);
router.post("/googleLogin", empGoogleLogin);
router.post("/Login", empLogin);
router.get("/skillData", empAuthentication, skillDetails);
router.get("/cityData", empAuthentication, cityDetails);
router.post("/createPost", empAuthentication, createPost);
router.post("/editPost/:id", empAuthentication, editPost);
router.post("/deletePost", empAuthentication, deletePost);
router.post("/completePost", empAuthentication, completePost);
router.get("/getpostdata", empAuthentication, getPostData);
router.get("/getactivepostdata", empAuthentication, getActivePostData);
router.get("/getsinglepostdata/:postId", empAuthentication, getSinglePostData);
router.get("/getuserdata/:userId", empAuthentication, getUserData);
router.get("/changeapplicationstatus/:postId/:userId/:newStatus",empAuthentication,changeApplicationStatus);
router.post("/changeImage",empAuthentication,upload.single("image"),changeImg)
router.post("/updateabout",empAuthentication,updateAbout)
router.post("/updatebasicinfo",empAuthentication,updateBasicInfo)
router.post("/empsearchuser",empAuthentication,empUserSearch)
router.post("/empinviteuser",empAuthentication,empUserInvite)

module.exports = router;
