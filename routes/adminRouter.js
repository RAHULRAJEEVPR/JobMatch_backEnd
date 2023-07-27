const express = require("express");
const router = express.Router();
const { adminAuthentication } = require("../middilewares/adminAuth");
const {
  adminLogin,
  userDetails,
  empDetails,
  adminAuth,
  changeUserStatus,
  changeEmpStatus,
  userCount ,
  empCount ,
  revenue
} = require("../controllers/adminController");
const {
  addSkill,
  skillDetails,
  dropSkill,
} = require("../controllers/skillController");
const {
  addCity,
  cityDetails,
  dropCity,
} = require("../controllers/cityController");
const {
  adminGetAllPostData,
  singleJobDetails,
  adminGetReportedPosts,
  changePostStatus
} = require("../controllers/postController");

router.post("/login", adminLogin);
router.get("/userDetails", adminAuthentication, userDetails);
router.get("/empDetails", adminAuthentication, empDetails);
router.get("/skillDetails", adminAuthentication, skillDetails);
router.post("/addskill", adminAuthentication, addSkill);
router.post("/dropskill", adminAuthentication, dropSkill);
router.post("/addcity", adminAuthentication, addCity);
router.get("/cityDetails", adminAuthentication, cityDetails);
router.post("/dropcity", adminAuthentication, dropCity);
router.get("/adminAuth", adminAuthentication, adminAuth);
router.post("/changeuserstatus", adminAuthentication, changeUserStatus);
router.post("/changeempstatus", adminAuthentication, changeEmpStatus);
router.post("/changepoststatus", adminAuthentication, changePostStatus);
router.get("/allpost", adminAuthentication, adminGetAllPostData);
router.get("/singlepost/:id", adminAuthentication, singleJobDetails); 
router.get("/revenue", adminAuthentication, revenue); 
router.get("/usercount", adminAuthentication, userCount ); 
router.get("/empcount", adminAuthentication, empCount ); 
router.get("/getreports", adminAuthentication, adminGetReportedPosts); 

module.exports = router;
