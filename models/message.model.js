import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema(
  {
    senderId:{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref:"User",
      required: true, 
    },
    reciverId:{ 
      type: mongoose.Schema.Types.ObjectId, 
      // reciver and sender is refrence to user Id
      ref:"User",
      required: true, 
    },
    text:{
      type:String,
    },
    image:{
      type:String,
    },
  },
  {Timestamp:true}
);

const Message = mongoose.model('Message', MessageSchema);

export default Message;
