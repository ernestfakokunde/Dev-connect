import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24  // auto-delete after 24 hours
  }
}, { timestamps: true });

export default mongoose.model("Story", storySchema);
