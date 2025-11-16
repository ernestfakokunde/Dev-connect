import express from "express";
import { createStory, getStories } from "../controllers/storyController.js";
import { protect } from "../middleware/middleware.js";
import multer from 'multer'
import path from 'path'

const router = express.Router();

// use memoryStorage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", protect, upload.single('image'), createStory);
router.get("/", protect, getStories);

export default router;
