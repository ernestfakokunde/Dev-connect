import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text:{
    type:String,
    required:true
  },
  createdAt:{
  type:Date,
  default:Date.now,
}
})


const postSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  text:{
    type:String,
    trim:true,
  },
  username:{
    type:String,
  },
  profilePic:{
    type:String,
  },
  image:{
    type:[String],
  },
  likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  }],
  comments:[commentSchema]
},{timestamps:true})

const Post = mongoose.model("Post",postSchema)
export default Post;