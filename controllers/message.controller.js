import cloudinary from "../config/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = async(req,res)=>{
  try{
    // since this route is user protected
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: {$ne:loggedInUserId}}).select("-password");
    // all user expect the user excluding their password

    return res.status(200).json({
      message: "All users found",
      status: "success",
      data:filteredUsers,
    });
  }
  catch(error){
    console.log(error);
    return res.status(400).json({
      message: `Internal Server error ${error}`,
      success: false,
    });
  }
};

export const getMessages = async(req,res)=>{
  try{
    // since we called ":id" 
    const {id:userToChatId} = req.params;
    const myId = req.user._id;
    // get all the message between sender and user
    const messages = await Message.find({
      $or:[
        {senderId:myId,receiverId:userToChatId},
        {senderId:userToChatId,receiverId:myId},
      ]
    });
    return res.status(200).json({
      message: "Messages found",
      status: "success",
      data:messages,
    });
  }
  catch(error){
    return res.send(400).json({
      message:`Internal Server Error ${error}`,
      success:false,
    });
  }
};

export const sendMessages = async(req,res)=>{
  try{
    const {text, image} = req.body;
    const {id: receiverId} = req.params; //naming the params to reciver Id (for readablity)
    const myId = req.user._id;
    let image_url;

    if(image){
      const uploadRespone = await cloudinary.uploader.upload(image);
      image_url = uploadRespone.secure_url;
    }

    const newMessage = new Message({
      senderId:myId,
      receiverId:receiverId,
      text:text,
      image:image_url,
    })

    await newMessage.save();

    // TODO : realtime message render using => socket.io

    return res.status(201).json({
      message: "Message sent",
      status: "success",
      data: newMessage,
    });
  }
  catch(error){
    return res.status(400).json({
      message: `sendMessages | Internal Server Error ${error}`,
      success:false,
    });
  }
};