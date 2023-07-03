const express=require("express")
const router=express.Router()
const {userAuthentication}=require("../middilewares/userAuth")
const{
    userRegister,
    userLogin,
    isUserAuth,
    userGoogleRegister,
    userGoogleLogin,
    verification
}=require("../controllers/userController")
const {userGetAllPosts,singleJobDetails}=require("../controllers/postController")
const { cityDetails } = require("../controllers/cityController");
const { skillDetails } = require("../controllers/skillController");



router.post("/register",userRegister)
router.post("/googleRegister",userGoogleRegister)
router.post("/googleLogin",userGoogleLogin)
router.post("/Login",userLogin)
router.get("/:id/verify/:token", verification)
router.get("/userAuth",userAuthentication,isUserAuth)
router.get("/getallpost",userAuthentication,userGetAllPosts)
router.get("/citydetails",userAuthentication,cityDetails)
router.get("/skilldata",userAuthentication,skillDetails)
router.get("/jobdetaileview/:id",userAuthentication,singleJobDetails)


module.exports=router;