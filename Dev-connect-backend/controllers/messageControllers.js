 import mongoose from "mongoose";
import Message from "../models/messageModel.js";
import uploadBuffer from '../utils/cloudinaryUpload.js'
import User from "../models/userModel.js";

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const sender = req.user._id;
    const { receiverId, text } = req.body;
    if (!receiverId) return res.status(400).json({ message: "Receiver required" });

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        if (f.buffer) {
          const res = await uploadBuffer(f.buffer, 'dev-connect/messages');
          images.push(res.secure_url || res.url);
        } else if (f.path || f.filename) {
          const p = (f.path || f.filename).replace(/\\/g, "/");
          images.push(p.startsWith("/") ? p : `/${p}`);
        }
      }
    }
    const message = await Message.create({ sender, receiver: receiverId, text, images });

    await message.populate("sender", "username profilePic");
    await message.populate("receiver", "username profilePic");

    req.io.to(receiverId.toString()).emit("newMessage", message);

    return res.status(201).json(message);
  } catch (err) {
    console.error("sendMessage:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET MESSAGES BETWEEN TWO USERS
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username profilePic")
      .populate("receiver", "username profilePic");

    await Message.updateMany(
      { sender: otherId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error("getMessages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CONVERSATIONS
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
      {
        $addFields: {
          ids: {
            $cond: [
              { $gt: ["$sender", "$receiver"] },
              { first: "$receiver", second: "$sender" },
              { first: "$sender", second: "$receiver" },
            ],
          },
        },
      },
      {
        $group: {
          _id: { sender: "$ids.first", receiver: "$ids.second" },
          lastMessage: { $last: "$$ROOT" },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    const populated = await Message.populate(
      conversations.map((c) => c.lastMessage),
      [
        { path: "sender", select: "username profilePic" },
        { path: "receiver", select: "username profilePic" },
      ]
    );

    res.json(populated);
  } catch (err) {
    console.error("getConversations:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SHARED MEDIA
export const getSharedMedia = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId },
      ],
      images: { $exists: true, $ne: [] },
    })
      .select("images createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const allMedia = [];
    messages.forEach((msg) => {
      if (msg.images && msg.images.length > 0) {
        msg.images.forEach((img) => {
          allMedia.push({
            url: img,
            createdAt: msg.createdAt,
          });
        });
      }
    });

    res.json(allMedia);
  } catch (err) {
    console.error("getSharedMedia:", err);
    res.status(500).json({ message: "Server error" });
  }
};