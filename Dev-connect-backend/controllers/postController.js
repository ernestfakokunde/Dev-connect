import Post from "../models/postModels.js";
import uploadBuffer from '../utils/cloudinaryUpload.js'

export const createPost = async(req,res)=>{
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // support multipart/form-data file uploads (multer) - multiple files will be in req.files
    const { text } = req.body;
    let images = [];

    console.log('createPost - req.body:', req.body);
    console.log('createPost - req.files:', req.files);
    console.log('createPost - req.user:', req.user?._id, req.user?.username);

    // multer.fields() stores files in req.files as object with arrays
    if (req.files) {
      // Consolidate all uploaded files from different fields (e.g., 'image', 'images') into one array
      const allFiles = Object.values(req.files).flat();

      // If files were uploaded as buffers (memoryStorage), upload them to Cloudinary
      for (const f of allFiles) {
        if (f.buffer) {
          try {
            const res = await uploadBuffer(f.buffer, 'dev-connect/posts');
            if (res && (res.secure_url || res.url)) {
              images.push(res.secure_url || res.url);
            }
          } catch (uploadError) {
            console.error('Cloudinary upload failed for one file:', uploadError);
            // Optionally, decide if you want to stop or continue if one file fails
          }
        }
      }
    } else if (req.body.image) {
      // allow comma-separated or single url in body
      if (typeof req.body.image === 'string' && req.body.image.includes(',')) {
        images = req.body.image.split(',').map(s => s.trim()).filter(Boolean);
      } else if (typeof req.body.image === 'string') {
        images = [req.body.image];
      }
    }

    // Allow empty text if there are images
    if (!text && images.length === 0) {
      return res.status(400).json({ message: "Post cannot be empty. Please add text or an image." });
    }

    const newPost = new Post({
      user: req.user._id,
      text: text || '',
      image: images,
      // denormalize some user info so posts keep username/profilePic even if user changes later
      username: req.user.username,
      profilePic: req.user.profilePic || '',
    })
    
    const savedPost = await newPost.save();
    
    // Populate user info before sending response
    await savedPost.populate("user", "username profilePic");
    
    console.log('createPost - Post saved successfully:', savedPost._id);
    res.status(201).json(savedPost)
  } catch (error) {
    console.error('createPost - Error:', error);
    res.status(500).json({message: "Failed to create post", error: error.message})
  }
}
 export const commentPost = async(req,res)=>{
  try {
      const { text } = req.body
      if(!text){
        return res.status(400).json({message:"comment cannot be empty"})
      }
        const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" })

      post.comments.push({user: req.user._id, text});
      await post.save();
      res.status(201).json(post.comments)
      
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
 }

 export const getPosts = async(req,res)=>{
  try {
    console.log('getPosts - Fetching all posts');
    const posts = await Post.find()
    .populate("user","username profilePic")
    .populate("comments.user","username profilePic")
    .sort({createdAt: -1});
    
    console.log('getPosts - Found', posts.length, 'posts');
    res.json(posts)
  } catch (error) {
    console.error('getPosts - Error:', error);
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
 }

 export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes.pull(req.user._id); // unlike
    } else {
      post.likes.push(req.user._id); // like
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error: error.message });
  }
};

export const getUserPost = async(req,res)=>{
try {
  const posts = await Post.find({user: req.params.id})
    .populate("user", "username profilePic")
    .populate("comments.user", "username profilePic")
    .sort({ createdAt: -1});
    res.json({posts});
} catch (error) {
  res.status(500).json({ message: "Failed to fetch user posts", error: error.message });
}
}
