// protect route

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req,res,next) => {
  try{
    const token = req.cookies.jwt;
    // since we store token with name jwt
    if(!token){
      return res.status(401).json({
        message: "Please login to access - No token",
        success:false,
      });
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    if(!decoded){
      return res.status(401).json({
        message:"Invalid Token",
        success:false,
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    // find the user details from the decoded user id from the jwt token => so we return every thing except the password

    if(!user){
      return res.status(404).json({
        message:"User not Found",
        success:false,
      });
    }
    req.user=user;
    // so after after all the check we add the user feild to request.
    next();
    // after this we call the next profile

  }
  catch(e){
    console.log(e);
    return res.status(401).json({
      message:"Unauthorized by protected Route",
      success:false,
    })
  }
}