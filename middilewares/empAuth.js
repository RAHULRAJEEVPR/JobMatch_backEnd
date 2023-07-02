const jwt =require("jsonwebtoken")

module.exports.empAuthentication=async(req,res,next)=>{
    try {
        console.log("emp āauthil vannyu")
       
        const token=req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: "Auth failed", success: false });
            } else {
              req.empId = decoded.id;
              next();
            }
          });
    } catch (error) {
        console.log(error);
    return res.status(401).json({ message: "Auth failed", success: false });
    }
}