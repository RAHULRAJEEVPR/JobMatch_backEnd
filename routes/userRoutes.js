const express=require("express")
const router=express.Router()
const{
    userRegister,
    userLogin
}=require("../controllers/userController")

router.post("/register",userRegister)
router.post("/user/Login",userLogin)

module.exports=router;