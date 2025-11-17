import projectSchema from "../models/projectModel.js";
import User from "../models/userModel.js";
import uploadBuffer from '../utils/cloudinaryUpload.js';
import mongoose from 'mongoose';

export const createProject = async (req,res)=>{
  try {
    const { title, description, experienceLevel, telegram, whatsapp, discord } = req.body;
    let image = '';
    if (req.file) {
      if (req.file.buffer) {
        const res = await uploadBuffer(req.file.buffer, 'dev-connect/projects');
        image = res.secure_url || res.url;
      } else if (req.file.filename) {
        image = `/uploads/projects/${req.file.filename}`;
      }
    }

    if(!title || !description || !experienceLevel){
      return res.status(400).json({ message:" All required fields must be filled." });
    }

    const newProject = await projectSchema.create({
      owner: req.user._id,
      projectName: title,
      projectDescription: description,
      experienceLevel,
      image,
      telegram,
      whatsapp,
      discord,
    
    })

    const populateProject = await newProject.populate("owner", " username profilePic")
    res.status(200).json({
      success:true,
      message:"Project created successully",
      project: populateProject,
    })
  } catch (error) {
     console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getAllProjects = async (req,res)=>{
  try {
    const projects = await projectSchema.find().populate("owner", " username profilePic").sort({ createdAt: -1 });
    res.status(200).json({
      success:true,
      projects,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getSingleProject = async (req,res)=>{
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid project ID" });

    const project = await projectSchema.findById(id).populate("owner", "username profilePic");
    if (!project){
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({success:true, project})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message});
  }
}

export const joinProject = async (req,res)=>{
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await projectSchema.findById(id)
    if(!project){
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    if(project.members.includes(userId)){
      return res.status(400).json({ success: false, message: "You are already a member of this project" });
    }
    project.members.push(userId);
    project.memberCount = project.members.length;
    await project.save();

    res.status(200).json({ success: true, message:"Joined project succcesfully", project, memberCount: project.memberCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getCurrentUserProjects = async (req,res)=>{
  try {
    const userId = req.user._id;
    const userProjects = await projectSchema.find({ owner:userId}).populate("owner", " username profilePic")

    res.status(200).json({ success:true, userProjects })
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message:"internal server error"});
  }
}

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectSchema.findById(id);

    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Unauthorized action" });

    await project.deleteOne();

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};