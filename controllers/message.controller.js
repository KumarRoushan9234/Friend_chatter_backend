import mongoose from "mongoose";
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

// export const getMessages = async(req,res)=>{
//   try{
//     // since we called ":id" 
//     const {id:userToChatId} = req.params;
//     const myId = req.user._id;
//     // get all the message between sender and user
    
//     // Validate ObjectId format
//     if (!mongoose.Types.ObjectId.isValid(userToChatId) || !mongoose.Types.ObjectId.isValid(myId)) {
//       return res.status(400).json({
//         message: "Invalid user ID format",
//         success: false,
//       });
//     }

//     // Convert to ObjectId
//     const messages = await Message.find({
//       $or: [
//         { senderId: new mongoose.Types.ObjectId(myId), receiverId: new mongoose.Types.ObjectId(userToChatId) },
//         { senderId: new mongoose.Types.ObjectId(userToChatId), receiverId: new mongoose.Types.ObjectId(myId) },
//       ],
//     });

//     console.log("myId:", myId, "userToChatId:", userToChatId);

//     return res.status(200).json({
//       message: "Messages found",
//       status: "success",
//       data:messages,
//     });
//   }
//   catch(error){
//     console.error("Error fetching messages:", error);
//     return res.status(400).json({
//       message: `Internal Server Error: ${error.message}`,
//       success:false,
//     });
//   }
// };


// export const sendMessages = async(req,res)=>{
//   try{
//     const {text} = req.body;
//     const {id: receiverId} = req.params; //naming the params to reciver Id (for readablity)
//     const myId = req.user._id;
//     let image_url;

//     console.log("Request body:", req.body);
//     // Debugging: Print out receiverId to check the value
//     console.log("Receiver ID:", receiverId);

//     // Convert receiverId to ObjectId => "new"
//     const receiverObjectId = new mongoose.Types.ObjectId(receiverId.replace(/^_/, ''));
//     // Remove the underscore from the receiverId before converting it to ObjectId:


//     // if(image){
//     //   const uploadRespone = await cloudinary.uploader.upload(image);
//     //   image_url = uploadRespone.secure_url;
//     // }

//     if (!receiverId) {
//       return res.status(400).json({
//         message: "Receiver ID is required.",
//         success: false
//       });
//     }

//     // TypeError: Class constructor ObjectId cannot be invoked without 'new'",

//     const newMessage = new Message({
//       senderId:myId,
//       receiverId:receiverObjectId,
//       text:text,
//       // image:image_url,
//     })

//     console.log("Message to save:", newMessage);

//     await newMessage.save();

//     // TODO : realtime message render using => socket.io

//     return res.status(201).json({
//       message: "Message sent",
//       status: "success",
//       data: newMessage,
//     });
//   }
//   catch(error){
//     return res.status(400).json({
//       message: `sendMessages | Internal Server Error ${error}`,
//       success:false,
//     });
//   }
// };

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    console.log("Received IDs:", { myId, userToChatId });

    // Check if userToChatId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userToChatId) || !mongoose.Types.ObjectId.isValid(myId)) {
      console.error("Invalid ID detected:", { myId, userToChatId });
      return res.status(400).json({
        message: "Invalid user ID format",
        success: false,
      });
    }

    // Convert to ObjectId
    const messages = await Message.find({
      $or: [
        { senderId: new mongoose.Types.ObjectId(myId), receiverId: new mongoose.Types.ObjectId(userToChatId) },
        { senderId: new mongoose.Types.ObjectId(userToChatId), receiverId: new mongoose.Types.ObjectId(myId) },
      ],
    });
    if (!messages.length) {
      return res.status(200).json({ 
        data: [],
        message: "No messages yet",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Messages found",
      status: "success",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      success: false,
    });
  }
};



export const sendMessages = async(req,res) => {
  try{
    const { text } = req.body;
    const { id: receiverId } = req.params; // using receiverId from params
    const myId = req.user._id;
    let image_url;

    console.log("Request body:", req.body);
    console.log("Receiver ID:", receiverId);

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required.",
        success: false
      });
    }

    // Convert receiverId to ObjectId (remove the underscore)
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId.replace(/^_/, ''));

    const newMessage = new Message({
      senderId: myId,
      receiverId: receiverObjectId, // Make sure it's receiverId here
      text: text,
      // image: image_url, // Uncomment this when the image upload logic is implemented
    });

    console.log("Message to save:", newMessage);

    await newMessage.save();

    // TODO: Implement real-time message rendering with socket.io

    return res.status(201).json({
      message: "Message sent",
      status: "success",
      data: newMessage,
    });
  } catch(error) {
    console.log(error);  // Add this to log the error and better debug
    return res.status(400).json({
      message: `sendMessages | Internal Server Error ${error}`,
      success: false,
    });
  }
};
