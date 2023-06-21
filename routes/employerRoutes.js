const express=require("express")
const router=express.Router()
const {
    empRegister,
    verification,
    empGoogleRegister,
    empGoogleLogin,
    empLogin
  } = require("../controllers/empController");
  

router.post("/register",empRegister)
router.get("/:id/verify/:token", verification)
router.post("/googleRegister",empGoogleRegister)
router.post("/googleLogin",empGoogleLogin)
router.post("/Login",empLogin)




module.exports=router;
