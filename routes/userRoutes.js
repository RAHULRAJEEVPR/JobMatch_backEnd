const express = require("express");
const router = express.Router();
const { userAuthentication } = require("../middilewares/userAuth");
const {
  userRegister,
  userLogin,
  isUserAuth,
  userGoogleRegister,
  userGoogleLogin,
  verification,
  updateUserAbout,
  addUserExp,
  addUserSkill,
  dropUserSkill,
  addUserEdu,
  dropUserExp,
  dropUserEdu,
  updateUserBasicInfo,
  changePassword,
  changeUserImg
} = require("../controllers/userController");
const {
  userGetAllPosts,
  singleJobDetails,
  applyJob,
} = require("../controllers/postController");
const { cityDetails } = require("../controllers/cityController");
const { skillDetails } = require("../controllers/skillController");
const upload =require("../middilewares/multer")

router.post("/register", userRegister);
router.post("/googleRegister", userGoogleRegister);
router.post("/googleLogin", userGoogleLogin);
router.post("/Login", userLogin);
router.get("/:id/verify/:token", verification);
router.get("/userAuth", userAuthentication, isUserAuth);
router.get("/getallpost", userAuthentication, userGetAllPosts);
router.get("/citydetails", userAuthentication, cityDetails);
router.get("/skilldata", userAuthentication, skillDetails);
router.get("/jobdetaileview/:id", userAuthentication, singleJobDetails);
router.post("/applyjob", userAuthentication,upload.single("resume"),applyJob)
router.post("/updateUserAbout", userAuthentication,updateUserAbout)
router.post("/addUserExp", userAuthentication,addUserExp)
router.post("/addUserSkill", userAuthentication,addUserSkill)
router.post("/dropUserSkill", userAuthentication,dropUserSkill)
router.post("/addUserEdu", userAuthentication,addUserEdu)
router.post("/dropUserExp", userAuthentication,dropUserExp)
router.post("/dropUserEdu", userAuthentication,dropUserEdu)
router.post("/updateUserBasicInfo", userAuthentication,updateUserBasicInfo)
router.post("/changeUserPassword", userAuthentication,changePassword)
router.post("/changeUserImage", userAuthentication,upload.single("image"),changeUserImg)

module.exports = router;
