const jwt=require("jsonwebtoken")

module.exports.adminAuthentication=async(req,res,next)=>{
    try {
        const token=req.headers["authorization"].split(" ")[1]
       

        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.status(401).json({message:"Auth failed",success:false})
            }else{
                req.adminId=decoded.id
                next()
            }
        })
    } catch (error) {
        console.log(error);
    return res.status(401).json({ message: "Auth failed", success: false }); 
    }
}