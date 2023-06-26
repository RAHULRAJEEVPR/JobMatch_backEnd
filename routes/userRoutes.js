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

router.post("/register",userRegister)
router.post("/googleRegister",userGoogleRegister)
router.post("/googleLogin",userGoogleLogin)
router.post("/Login",userLogin)
router.get("/userAuth",userAuthentication,isUserAuth)
router.get("/:id/verify/:token", verification)

module.exports=router;