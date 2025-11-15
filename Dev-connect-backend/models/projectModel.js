 import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    projectDescription: {
      type: String,
      required: true,
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    image: {
      type: String, // Uploaded image URL
      default: "",
    },
    telegram: {
      type: String,
      trim: true,
      default: "",
    },
    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },
    discord: {
      type: String,
      trim: true,
      default: "",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    memberCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

  projectSchema.pre("save", function(next) {
    this.memberCount = this.members.length;
    next();
  });

export default mongoose.model("Project", projectSchema);
