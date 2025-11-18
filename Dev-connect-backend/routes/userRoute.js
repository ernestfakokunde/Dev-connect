import express from 'express';
import User from '../models/userModel.js';
import { registerUser,loginUser,getUser, initializePayment, verifyPayment } from '../controllers/userController.js';
import { protect } from '../middleware/middleware.js'
import multer from "multer"
import path from "path"
import streamifier from 'streamifier'
import cloudinary from '../config/cloudinaryConfig.js'
import { verify } from 'crypto';
const router = express.Router();

// set up multer for image upload (memory storage for Cloudinary)
const storage = multer.memoryStorage();

// List all users (simple suggestions endpoint) - protected so we can filter based on relations
router.get('/all', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    // return everyone except the requester
    const filtered = users.filter(u => String(u._id) !== String(req.user._id));
    res.json(filtered);
  } catch (err) {
    console.error('list users error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const upload = multer({ storage });

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect , getUser)
router.post("/initializePayment",protect, initializePayment)
router.get("/verify/:reference",protect, verifyPayment)
//Route to update userProfile

router.patch("/profile", protect, upload.single("profilePic"), async(req,res)=>{
  try {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(404).json({success: false, message: "User not found"});

    // Validate profileName is provided and not empty
    if(req.body.profileName !== undefined) {
      if(!req.body.profileName || req.body.profileName.trim() === '') {
        return res.status(400).json({success: false, message: "Display name is required"});
      }
      user.profileName = req.body.profileName.trim();
    }

    // Update other fields if provided (allow empty strings to clear fields)
    if(req.body.town !== undefined) user.town = req.body.town;
    if(req.body.placeOfBirth !== undefined) user.placeOfBirth = req.body.placeOfBirth;
    if(req.body.gender !== undefined) user.gender = req.body.gender;
    if(req.body.bio !== undefined) user.bio = req.body.bio;

    // Update profile picture if provided - upload to Cloudinary
    if (req.file) {
      try {
        const buffer = req.file.buffer;
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'dev-connect/profiles' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          streamifier.createReadStream(buffer).pipe(stream).on('error', reject);
        });

        // Store the secure URL returned by Cloudinary
        user.profilePic = uploadResult.secure_url || uploadResult.url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ success: false, message: 'Image upload failed', error: err.message });
      }
    }

    // Mark profile as completed if profileName is set
    if(user.profileName && user.profileName.trim() !== '') {
      user.isProfileCompleted = true;
    }

    const updatedUser = await user.save();
    res.json({success:true, user:updatedUser });
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({success:false, message: "Profile update failed", error: error.message})
  }
})

  // Get a user's public profile and relation flags (requires auth to compute relationship)
  router.get('/profile/:id', protect, async (req, res) => {
    try {
      const target = await User.findById(req.params.id).select('-password').lean()
      if (!target) return res.status(404).json({ message: 'User not found' })

      const me = await User.findById(req.user._id).lean()
      const isFriend = Array.isArray(me.friends) && me.friends.some(f => String(f) === String(target._id))
      const requestSent = Array.isArray(me.friendRequestsSent) && me.friendRequestsSent.some(f => String(f) === String(target._id))
      const requestReceived = Array.isArray(me.friendRequestsReceived) && me.friendRequestsReceived.some(f => String(f) === String(target._id))

      return res.json({ user: target, relation: { isFriend, requestSent, requestReceived } })
    } catch (err) {
      console.error('profile fetch error', err)
      return res.status(500).json({ message: 'Server error' })
    }
  })

  // Send a friend request to :id
  router.post('/friend-request/:id', protect, async (req, res) => {
    try {
      const fromId = String(req.user._id)
      const toId = String(req.params.id)
      if (fromId === toId) return res.status(400).json({ message: 'Cannot friend yourself' })
      const [fromUser, toUser] = await Promise.all([User.findById(fromId), User.findById(toId)])
      if (!toUser) return res.status(404).json({ message: 'Target user not found' })

      // already friends
      if ((fromUser.friends || []).some(f => String(f) === toId)) return res.status(400).json({ message: 'Already friends' })

      // already sent
      if ((fromUser.friendRequestsSent || []).some(f => String(f) === toId)) return res.status(400).json({ message: 'Request already sent' })

      fromUser.friendRequestsSent = Array.from(new Set([...(fromUser.friendRequestsSent || []), toId]))
      toUser.friendRequestsReceived = Array.from(new Set([...(toUser.friendRequestsReceived || []), fromId]))

      await Promise.all([fromUser.save(), toUser.save()])
      return res.json({ message: 'Friend request sent' })
    } catch (err) {
      console.error('send friend request error', err)
      return res.status(500).json({ message: 'Server error' })
    }
  })

  // Accept a friend request from :id (id is the sender)
  router.post('/friend-request/:id/accept', protect, async (req, res) => {
    try {
      const meId = String(req.user._id)
      const fromId = String(req.params.id)
      const me = await User.findById(meId)
      const from = await User.findById(fromId)
      if (!from) return res.status(404).json({ message: 'User not found' })

      // ensure a pending request exists
      if (!((me.friendRequestsReceived || []).some(f => String(f) === fromId))) return res.status(400).json({ message: 'No pending request from this user' })

      // add to friends for both
      me.friends = Array.from(new Set([...(me.friends || []), fromId]))
      from.friends = Array.from(new Set([...(from.friends || []), meId]))

      // remove pending entries
      me.friendRequestsReceived = (me.friendRequestsReceived || []).filter(f => String(f) !== fromId)
      from.friendRequestsSent = (from.friendRequestsSent || []).filter(f => String(f) !== meId)

      await Promise.all([me.save(), from.save()])
      return res.json({ message: 'Friend request accepted' })
    } catch (err) {
      console.error('accept friend error', err)
      return res.status(500).json({ message: 'Server error' })
    }
  })

  // Decline a friend request (remove pending)
  router.post('/friend-request/:id/decline', protect, async (req, res) => {
    try {
      const meId = String(req.user._id)
      const fromId = String(req.params.id)
      const me = await User.findById(meId)
      const from = await User.findById(fromId)
      if (!from) return res.status(404).json({ message: 'User not found' })

      me.friendRequestsReceived = (me.friendRequestsReceived || []).filter(f => String(f) !== fromId)
      from.friendRequestsSent = (from.friendRequestsSent || []).filter(f => String(f) !== meId)

      await Promise.all([me.save(), from.save()])
      return res.json({ message: 'Friend request declined' })
    } catch (err) {
      console.error('decline friend error', err)
      return res.status(500).json({ message: 'Server error' })
    }
  })

  // Cancel a sent friend request
  router.post('/friend-request/:id/cancel', protect, async (req, res) => {
    try {
      const meId = String(req.user._id)
      const toId = String(req.params.id)
      const me = await User.findById(meId)
      const to = await User.findById(toId)
      if (!to) return res.status(404).json({ message: 'User not found' })

      me.friendRequestsSent = (me.friendRequestsSent || []).filter(f => String(f) !== toId)
      to.friendRequestsReceived = (to.friendRequestsReceived || []).filter(f => String(f) !== meId)

      await Promise.all([me.save(), to.save()])
      return res.json({ message: 'Friend request canceled' })
    } catch (err) {
      console.error('cancel friend request error', err)
      return res.status(500).json({ message: 'Server error' })
    }
  })

  // Remove friend
  router.delete('/friend/:id', protect, async (req, res) => {
    try {
      const meId = String(req.user._id)
      const otherId = String(req.params.id)
      const me = await User.findById(meId)
      const other = await User.findById(otherId)
      if (!other) return res.status(404).json({ message: 'User not found' })

      me.friends = (me.friends || []).filter(f => String(f) !== otherId)
      other.friends = (other.friends || []).filter(f => String(f) !== meId)

      await Promise.all([me.save(), other.save()])
      return res.json({ message: 'Friend removed' })
    } catch (err) {
      console.error('remove friend error', err)
      return res.status(500).json({ message: 'Server error' })
    }
  })

  // List my friends
  router.get('/friends', protect, async (req, res) => {
    try {
      const me = await User.findById(req.user._id).populate('friends', 'username profileName profilePic').lean()
      return res.json(me.friends || [])
    } catch (err) {
      console.error('friends list error', err)
      return res.status(500).json({ message: 'Server error' })
    }
  })

  // List incoming friend requests
  router.get('/friend-requests', protect, async (req, res) => {
    try {
      const me = await User.findById(req.user._id).populate('friendRequestsReceived', 'username profileName profilePic').lean()
      return res.json(me.friendRequestsReceived || [])
    } catch (err) {
      console.error('friend requests list error', err)
      return res.status(500).json({ message: 'Server error' })
    }
  })

  // Search users by username or email
  router.get('/search', protect, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || q.trim().length === 0) {
        return res.json([]);
      }
      const searchRegex = new RegExp(q, 'i');
      const users = await User.find({
        $or: [
          { username: searchRegex },
          { email: searchRegex },
          { profileName: searchRegex }
        ],
        _id: { $ne: req.user._id }
      })
        .select('username profileName profilePic email town')
        .limit(50)
        .lean();
      return res.json(users);
    } catch (err) {
      console.error('user search error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  })

  // Get all users with mutual friends count and relationship status
  router.get('/suggestions', protect, async (req, res) => {
    try {
      const me = await User.findById(req.user._id).lean();
      if (!me) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const myFriends = (me.friends || []).map(f => String(f));
      const mySentRequests = (me.friendRequestsSent || []).map(f => String(f));
      const myReceivedRequests = (me.friendRequestsReceived || []).map(f => String(f));
      
      console.log('Current user:', req.user._id);
      console.log('My friends:', myFriends);
      
      // Get ALL users except self
      const allUsers = await User.find({
        _id: { $ne: req.user._id }
      })
        .select('username profileName profilePic town friends email')
        .populate({
          path: 'friends',
          select: 'profilePic username _id'
        })
        .lean();
      
      console.log('Total users found:', allUsers.length);
      
      // Calculate mutual friends and relationship status for each user
      const suggestions = allUsers.map(user => {
        const userId = String(user._id);
        const userFriends = (user.friends || []).map(f => String(f._id || f));
        const mutualFriends = myFriends.filter(f => userFriends.includes(f));
        const mutualFriendsData = (user.friends || [])
          .filter(f => myFriends.includes(String(f._id || f)))
          .slice(0, 2)
          .map(f => ({ _id: f._id, profilePic: f.profilePic }));
        
        // Determine relationship status
        const isFriend = myFriends.includes(userId);
        const requestSent = mySentRequests.includes(userId);
        const requestReceived = myReceivedRequests.includes(userId);
        
        return {
          ...user,
          mutualFriendsCount: mutualFriends.length,
          mutualFriends: mutualFriendsData,
          isFriend,
          requestSent,
          requestReceived
        };
      });
      
      // Sort by mutual friends count (highest first)
      suggestions.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);
      
      console.log('Returning suggestions:', suggestions.length);
      return res.json(suggestions);
    } catch (err) {
      console.error('suggestions error', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  })

  // Get friend requests with mutual friends
  router.get('/friend-requests-detailed', protect, async (req, res) => {
    try {
      const me = await User.findById(req.user._id).populate({
        path: 'friendRequestsReceived',
        select: 'username profileName profilePic town friends',
        populate: {
          path: 'friends',
          select: 'profilePic username'
        }
      }).lean();
      const myFriends = (me.friends || []).map(f => String(f));
      
      const requests = (me.friendRequestsReceived || []).map(request => {
        const requestFriends = (request.friends || []).map(f => String(f._id || f));
        const mutualFriends = myFriends.filter(f => requestFriends.includes(f));
        const mutualFriendsData = (request.friends || [])
          .filter(f => myFriends.includes(String(f._id || f)))
          .slice(0, 2)
          .map(f => ({ _id: f._id, profilePic: f.profilePic }));
        
        return {
          ...request,
          mutualFriendsCount: mutualFriends.length,
          mutualFriends: mutualFriendsData
        };
      });
      
      return res.json(requests);
    } catch (err) {
      console.error('friend requests detailed error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  })

export default router;
