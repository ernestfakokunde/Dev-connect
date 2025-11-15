// friendRoutes.js
import express from "express";
import { protect } from "../middleware/middleware.js";
import * as friendCtrl from "../controllers/friendController.js";

const router = express.Router();

// POST /api/friends/request/:receiverId - send friend request
router.post("/request/:receiverId", protect, (req, res) => {
  req.body.receiverId = req.params.receiverId;
  friendCtrl.sendFriendRequest(req, res);
});
// POST /api/friends/send - also support POST /send for backward compatibility
router.post("/send", protect, friendCtrl.sendFriendRequest);
// PUT /api/friends/accept/:requestId - accept friend request
router.put("/accept/:id", protect, (req, res) => {
  req.body.action = "accept";
  friendCtrl.respondToRequest(req, res);
});
// POST /api/friends/:id/respond - respond to request (accept/reject)
router.post("/:id/respond", protect, friendCtrl.respondToRequest);
// DELETE /api/friends/remove/:friendId - remove friend
router.delete("/remove/:friendId", protect, friendCtrl.removeFriend);
// GET /api/friends/list/:userId - get all friends for a user
router.get("/list/:userId", protect, friendCtrl.getFriendsList);
// GET /api/friends/ - get friends and requests for current user
router.get("/", protect, friendCtrl.getFriendsAndRequests);

export default router;
