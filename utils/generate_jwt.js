import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken=(userId,res) =>{

  // Generate JWT token
  const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn: "8h", // Set token expiration time
  });

  // Set the token as a cookie in the response

  res.cookie("jwt",token,{
    httpOnly: true, //prevents XSS attacks
    // cookie inaccessible to JS
    maxAge: 7*24*60*60*1000 , //MS
    sameSite: "strict",
    // Helps prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development",
  });

  // Return token if needed for other funtion
  
  return token;

  // we generate token and send to user in form of cookie
};