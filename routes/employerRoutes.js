const express = require("express");
const router = express.Router();
const { createPost, getPostData,editPost } = require("../controllers/postController");
const { empAuthentication } = require("../middilewares/empAuth");
const {
  empRegister,
  verification,
  empGoogleRegister,
  empGoogleLogin,
  empLogin,
} = require("../controllers/empController");
const { skillDetails } = require("../controllers/skillController");
const { cityDetails } = require("../controllers/cityController");

router.post("/register", empRegister);
router.get("/:id/verify/:token", verification);
router.post("/googleRegister", empGoogleRegister);
router.post("/googleLogin", empGoogleLogin);
router.post("/Login", empLogin);
router.get("/skillData", empAuthentication, skillDetails);
router.get("/cityData", empAuthentication, cityDetails);
router.post("/createPost", empAuthentication, createPost);
router.post("/editPost/:id", empAuthentication, editPost);
router.get("/getpostdata", empAuthentication,getPostData);
module.exports = router;
