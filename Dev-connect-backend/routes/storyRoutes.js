import express from "express";
import { createStory, getStories } from "../controllers/storyController.js";
import { protect } from "../middleware/middleware.js";
import multer from 'multer'
import path from 'path'

const router = express.Router();

// multer storage for story uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/storyUploads/'),
	filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post("/", protect, upload.single('image'), createStory);
router.get("/", protect, getStories);

export default router;
