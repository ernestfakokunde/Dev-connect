import FriendRequest from "../models/friendRequestModel.js";
import User from "../models/userModel.js";

// SEND REQUEST
export const sendFriendRequest = async (req, res) => {
  const sender = req.user._id;
  const { receiverId } = req.body;

  const existing = await FriendRequest.findOne({ sender, receiver: receiverId });
  if (existing) return res.status(400).json({ message: "Request already sent" });

  const request = await FriendRequest.create({ sender, receiver: receiverId });
  res.status(201).json(request);
};

// ACCEPT / REJECT
export const respondToRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const status = action === "accept" ? "accepted" : "rejected";
  const request = await FriendRequest.findByIdAndUpdate(id, { status }, { new: true });

  res.json(request);
};

// GET FRIENDS + REQUESTS
export const getFriendsAndRequests = async (req, res) => {
  const userId = req.user._id;

  const requests = await FriendRequest.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "username profilePic")
    .populate("receiver", "username profilePic");

  const friends = requests.filter((r) => r.status === "accepted");
  const pending = requests.filter((r) => r.status === "pending");

  res.json({ friends, pending });
};

// GET FRIENDS LIST BY USER ID
export const getFriendsList = async (req, res) => {
  try {
    const { userId } = req.params;
    const targetUserId = userId || req.user._id;

    const requests = await FriendRequest.find({
      $or: [{ sender: targetUserId }, { receiver: targetUserId }],
      status: "accepted",
    })
      .populate("sender", "username profilePic")
      .populate("receiver", "username profilePic");

    res.json({ friends: requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch friends", error: error.message });
  }
};

// REMOVE FRIEND
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    // Find the friend request (either as sender or receiver)
    const friendRequest = await FriendRequest.findOne({
      $or: [
        { sender: userId, receiver: friendId, status: "accepted" },
        { sender: friendId, receiver: userId, status: "accepted" },
      ],
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend relationship not found" });
    }

    // Delete the friend request (which removes the friendship)
    await FriendRequest.findByIdAndDelete(friendRequest._id);

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove friend", error: error.message });
  }
};