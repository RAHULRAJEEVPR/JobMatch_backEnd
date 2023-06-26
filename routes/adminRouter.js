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
router.get("/userDetails", userDetails);
router.get("/empDetails", empDetails);
router.get("/skillDetails", skillDetails);
router.post("/addskill", addSkill);
router.post("/dropskill", dropSkill);
router.post("/addcity",addCity);
router.get("/cityDetails",cityDetails)
router.post("/dropcity",dropCity)
router.get("/adminAuth", adminAuthentication, adminAuth);

module.exports = router;
