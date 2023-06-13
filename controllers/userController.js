const userModel=require("../model/userModel")
const bcrypt=require("bcryptjs")
const userRegister=async(req,res)=>{
    try {
        let { name, email, password } = req.body

        const exists= await userModel.findOne({email:email})
        if(exists){
       return res.status(400).json({exists:true,error:"email already exists"})
        }else{

        }
        const salt =await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        password=hashedPassword

        const newUser= new userModel({
            name:name,
            email:email,
            password:password
        })
        await newUser.save().then(console.log("updated"))
        res.status(201).json({userId:newUser._id,created:true,message:"registration succesfull"})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message, created: false }); 
    }
}
const userLogin=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
userRegister,
userLogin
}