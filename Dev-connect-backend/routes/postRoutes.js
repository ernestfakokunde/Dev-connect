import { createPost, getPosts, likePost, commentPost, getUserPost } from "../controllers/postController.js";
import express from "express"
import {protect} from "../middleware/middleware.js"
import multer from 'multer'
import path from 'path'

const router = express.Router();

// multer memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// accept multiple images (field name: images) or a single file (field name: image)
// use fields to support both client variants
// POST /api/posts/create or /api/posts/ - create post
router.post(
	"/create",
	protect,
	upload.fields([
		{ name: 'images', maxCount: 6 },
		{ name: 'image', maxCount: 1 },
	]),
	createPost
);
// Also support POST / for backward compatibility
router.post(
	"/",
	protect,
	upload.fields([
		{ name: 'images', maxCount: 6 },
		{ name: 'image', maxCount: 1 },
	]),
	createPost
);
// GET /api/posts/ - get all posts
router.get("/", protect, getPosts)
// PATCH /api/posts/like/:id - like/unlike post
router.patch("/like/:id", protect, likePost)
// POST /api/posts/like/:id - add comment (note: should be /comment/:id but keeping for compatibility)
router.post("/like/:id", protect, commentPost)
router.post("/comments/:id", protect, commentPost)
// GET /api/posts/user/:userId - get posts by user
router.get("/user/:id", protect, getUserPost)

export default router;