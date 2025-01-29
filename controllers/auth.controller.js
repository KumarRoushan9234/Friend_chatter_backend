import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generate_jwt.js'

// Regiter chatter 
export const registerUser = async (req, res) => {
  const { name, email, password, } = req.body;
  try {
    if(!name || !email || !password){
      return res.status(400).json({
        message: 'Please fill in all fields.',
        success:false,
      });
    }
    if(password.length<6){
      return res.status(400).json({
        message : "Password must be at least 6 charaters.",success:false
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message:"User already exists",
        success:false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    // const newUser = await User.create({ name, email, password });

    const newUser = await new User({
      name:name,
      email:email,
      password:hashedPassword
    });
    // creating a new User object and saving it
    await newUser.save();

    const user_data = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    // without token
    // if (newUser) {
    //   // res.status(201).json({
    //   //   _id: newUser.id,
    //   //   name: newUser.name,
    //   //   email: newUser.email,
    //   // });
    //   res.status(201).json({
    //     data:user_data,
    //     success:true,
    //     message:"User SignIN Successful"
    //   });
    // } 
    // else {
    //   res.status(400).json({
    //     message:"Invalid user data",
    //     success:false,
    //   });
    // }

    // generate jwt token 
    if(newUser){
      generateToken(newUser._id,res);
      await newUser.save();

      return res.status(201).json({
        data:user_data,
        success:true,
        message:"User SignIn Successful"
      });
    } 
    else {
      return res.status(400).json({
        message:"Invalid user data",
        success:false,
      });
    }

  } 
  catch (error) {
    // internal error
    return res.status(500).json({ 
      message: error.message,
      success:false 
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({
        message: "Invalid user data",
        success: false,
      });
    }

    // check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
      return res.status(400).json({
        message: "Invalid password",
        success: false,
      });
    }

    // Generate JWT token and set the cookie
    generateToken(user._id, res); // Pass res to generate the token and set the cookie
    const user_data = {
      _id: user._id,
      name: user.name,
      email:user.email,
    };
      // here the respone comes from the jwt function
    return res.status(201).json({
      data:user_data,
      message: "User logged in successfully",
      success: true,
    });
    // when we donot return imediatelty after a edge case it shutsdown the whole server.
  }
  catch (error) {
    return res.status(500).json({ 
      message: error.message,
      success:false,
    });
  }
};

export const logoutUser = async (req, res) => {
  
  // for logout => just clear the cookie
  try {
    res.clearCookie("jwt","",{maxAge:0});
    return res.status(200).json({
      message:"User Logged Out Successfully!",
      success:true,
    });
  } 
  catch (error) {
    return res.status(500).json({ 
      message: error.message,
      success:false, 
    });
  }
};

export const updateUser = async (req, res) => {
  // since this function is directly under the protected; therefore we call/get data using the protected path
  try {
    const { name, email} = req.body;
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (name) user.name = name;
    if (email) user.email = email;

    // if in case future password
    // if (password) {
    //   if (password.length < 6) {
    //     return res.status(400).json({
    //       message: "Password must be at least 6 characters.",
    //       success: false,
    //     });
    //   }

    //   const salt = await bcrypt.genSalt(10);
    //   user.password = await bcrypt.hash(password, salt);
    // }

    // Save updated user
    const updatedUser = await user.save();
    
    const userData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    };

    return res.status(200).json({
      message: "User Updated Successfully!",
      success: true,
      data:userData,
    });
  }
  catch (error) {
    return res.status(500).json({ 
      message: error.message,
      success: false,
    });
  }
};

export const checkAuth = async (req,res) => {
  try{
    const user = req.user;
    return res.status(200).json({
      message: "User Authenticated Successfully!",
      success: true,
      data:user,
    });
  }
  catch(error){
    console.log("Error in check Auth Controller",error.message);
    return res.status(500).json({
      message:"Error in check Auth Controller",
      success: false,
    });
  }
};