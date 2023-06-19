const express=require("express")
const router=express.Router()
const {userAuthentication}=require("../middilewares/userAuth")
const{
    userRegister,
    userLogin,
    userDetails,
    userGoogleRegister,
    userGoogleLogin
}=require("../controllers/userController")

router.post("/register",userRegister)
router.post("/googleRegister",userGoogleRegister)
router.post("/googleLogin",userGoogleLogin)
router.post("/Login",userLogin)
router.get("/userinfo",userAuthentication,userDetails)

module.exports=router;