const userModel=require("../model/userModel")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const userRegister=async(req,res)=>{
    try {
        let { name, email, password } = req.body

        const exists= await userModel.findOne({email:email})
        if(exists){
       return res.status(200).json({exists:true,message:"email already exists"})
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


const userGoogleRegister=async(req,res)=>{
    try {
        let { name, email, id,picture } = req.body

        const exists= await userModel.findOne({email:email})
        if(exists){
       return res.status(200).json({exists:true,message:"email already exists"})
        }else{

        }
        const salt =await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(id,salt)
     let   password=hashedPassword

        const newUser= new userModel({
            name:name,
            email:email,
            password:password,
            image:picture
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
         const {email,password}=req.body
         console.log(email);
        const userData= await userModel.findOne({email:email})
        console.log("vanno1");
        if(!userData){
           return res.status(404).json({message:"invalid email",login:false})
        }
        console.log(userData);

        const isMatch=await bcrypt.compare(password,userData.password)
        if(!isMatch){
            return res.status(401).json({message:"invalid passowrd",login:false})

        }else{
           const token=jwt.sign({id:userData._id},process.env.JWT_SECRET,{expiresIn:300000} )
           res.status(200).json({login:true,message:"login successful",token:token})
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message, login: false }); 
    }
}
const userGoogleLogin=async(req,res)=>{
    try {
         const {email,id}=req.body
         console.log(email);
        const userData= await userModel.findOne({email:email})
        console.log("google vanno");
        if(!userData){
           return res.status(404).json({message:"invalid email",login:false})
        }
        console.log(userData);

        const isMatch=await bcrypt.compare(id,userData.password)
        if(!isMatch){
            return res.status(401).json({message:"invalid passowrd",login:false})

        }else{
           const token=jwt.sign({id:userData._id},process.env.JWT_SECRET,{expiresIn:300000} )
           res.status(200).json({login:true,message:"login successful",token:token})
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message, login: false }); 
    }
}
const userDetails=async(req,res)=>{
try {
    console.log("vanno");
    const userData=await userModel.findOne({_id:req.userId})
    if(!userData){
        return res.status(200).json({message:"user does not exists",success:false})
    }else{
         return res.status(200).json({success:true,userData:userData})
    }
} catch (error) {
    console.log(error);
    return res.status(500).json({success:false})

}
}

module.exports={
userRegister,
userLogin,
userDetails,
userGoogleRegister,
userGoogleLogin
}