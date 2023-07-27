const jwt = require("jsonwebtoken");
const userModal = require("../model/userModel");
const { findOne } = require("../model/postModel");
module.exports.userAuthentication = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Auth failed", success: false });
      } else {
        req.userId = decoded.id;
        next()
      }
    });
    const user = await userModal.findOne({ _id: req.userId });
    // if (user.status===true) {
    //   next();
    // }else{
    //   return res.status(401).json({ message: "Auth failed", success: false });

    // }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Auth failed", success: false });
  }
};
