import User from '../models/userModel.js'
import jwt from "jsonwebtoken"

export const protect = async(req,res, next)=>{
let token;
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
  try {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('protect middleware - token decoded id:', decoded.id);

    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      console.log('protect middleware - User not found for id:', decoded.id);
      return res.status(401).json({message: "User not found"})
    }
    
    console.log('protect middleware - User authenticated:', req.user.username);
    return next();
  } catch (error) {
    // Log the raw header and token for debugging (dev only)
    console.log('protect middleware - authorization header:', req.headers.authorization);
    console.log('protect middleware - token value:', token);
    console.log("Token verification failed:", error.message);
    return res.status(401).json({message: "Token verification failed", error: error.message})
  }
}
console.log('protect middleware - no or invalid Authorization header present');
return res.status(401).json({message: "Token verification failed"})
}