import Story from "../models/storyModel.js";

// Create story (supports file upload via multer as `req.file`)
export const createStory = async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/storyUploads/${req.file.filename}`;
    }

    const newStory = new Story({
      userId: req.user._id || req.user.id,
      imageUrl,
      text,
    });
    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all stories (for feed)
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("userId", "username profilePic")
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
