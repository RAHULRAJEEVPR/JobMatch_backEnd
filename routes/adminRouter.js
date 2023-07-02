const express = require("express");
const router = express.Router();
const { adminAuthentication } = require("../middilewares/adminAuth");
const {
  adminLogin,
  userDetails,
  empDetails,
  adminAuth,
} = require("../controllers/adminController");
const { addSkill,
  skillDetails,
  dropSkill,} =require("../controllers/skillController")
  const {addCity,
    cityDetails,
    dropCity
  }=require("../controllers/cityController")

router.post("/login", adminLogin);
router.get("/userDetails",adminAuthentication , userDetails);
router.get("/empDetails",adminAuthentication , empDetails);
router.get("/skillDetails",adminAuthentication , skillDetails);
router.post("/addskill",adminAuthentication , addSkill);
router.post("/dropskill",adminAuthentication , dropSkill);
router.post("/addcity",adminAuthentication ,addCity);
router.get("/cityDetails",adminAuthentication ,cityDetails)
router.post("/dropcity",adminAuthentication ,dropCity)
router.get("/adminAuth", adminAuthentication, adminAuth);

module.exports = router;
