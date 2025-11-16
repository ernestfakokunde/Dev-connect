 // messageRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/middleware.js";
import  {sendMessage, getConversations, getMessages, getSharedMedia} from  "../controllers/messageControllers.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/messages/send - send message
router.post("/send", protect, upload.array("images", 6), sendMessage);
// POST /api/messages/ - also support POST / for backward compatibility
router.post("/", protect, upload.array("images", 6), sendMessage);
// GET /api/messages/conversations - get all conversations
router.get("/conversations", protect, getConversations);
// GET /api/messages/user/:userId - get all user's conversations (alternative)
router.get("/user/:userId", protect, getConversations);
// GET /api/messages/:conversationId - fetch messages (using otherId as conversationId)
router.get("/:otherId", protect, getMessages);
// GET /api/messages/:otherId/media - get shared media
router.get("/:otherId/media", protect, getSharedMedia);

export default router;
