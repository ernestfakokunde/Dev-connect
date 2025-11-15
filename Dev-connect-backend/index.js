import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoute.js';
import postRoutes from './routes/postRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import friendRoutes from './routes/friendRoutes.js'; // ✅ add this if you have friends system
import projectRoutes from './routes/projectRoutes.js';

import Message from './models/messageModel.js';
import User from './models/userModel.js';

dotenv.config();
connectDB();

const app = express();
const __dirname = path.resolve();

// ─── MIDDLEWARES ──────────────────────────────────────────────
// CORS configuration - allow specific origin when credentials are used
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allow cookies/credentials
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static image uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ─── HTTP SERVER + SOCKET SETUP ───────────────────────────────
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: { 
    origin: "http://localhost:5173",
    credentials: true
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user joins their own room for direct messaging
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // listen for new messages (optional enhancement)
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const newMessage = await Message.create({ sender: senderId, receiver: receiverId, text });

      // populate sender before emitting
      const populated = await newMessage.populate("sender", "username profilePic");

      io.to(receiverId).emit("receiveMessage", populated); // send message to receiver
      io.to(senderId).emit("messageSent", populated); // send confirmation to sender
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ─── INJECT io TO REQUEST OBJECT ──────────────────────────────
app.use((req, _, next) => {
  req.io = io;
  next();
});

// ─── ROUTES ───────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('App is running ✅');
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/projects', projectRoutes); // ✅ add this if you have projects
app.use('/api/friends', friendRoutes); // optional, if you have this file

// ─── SERVER START ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
// handle listen errors (eg. port already in use) so we fail cleanly with a clear message
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the process using it or set a different PORT environment variable.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

server.listen(PORT, () => console.log(`✅ Server (with sockets) running on port ${PORT}`));
