import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const registerUser = async (req, res)=>{
  const { username, email, password} = req.body;
 try {
   //validate user input
   if(!username || !email || !password){
    return res.status(400).json({message: "please fill in all fields"})
  }

  //check if user already exists
  const userExists = await User.findOne({email})
  if(userExists){
    return res.status(400).json({message: "user already exists"})
  }

  //create a new user
  const user = await User.create({username, email, password})
  const token = generateToken(user._id)
  res.status(201).json({
    id: user._id,
    username: user.username,
    email: user.email,
    token,
    message: "user created successfully"
  })
 } catch (error) {
  res.status(500).json({message: "internal server error"})
 }
}

export const loginUser = async (req, res)=>{
  const { email, password} = req.body;
  try {
    //check if user exists
    if(!email || !password){
      return res.status(400).json({message:"please fill in all fields"})
    }

    const user = await User.findOne({email})
    
    //check incase user does not exists or provides a wrong password
    if(!user || !(await user.matchPassword(password))){
      return res.status(401).json({message:"user does not exists"})
    }
    
    const token = generateToken(user._id)
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
      message: "user logged in successfully"
    })
  } catch (error) {
    res.status(500).json({message: "internal server error"})
  }
};

export const getUser = async(req,res)=>{
  res.status(200).json(req.user)
}

const generateToken = (id)=>{
  return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:"30d"})
}

export const initializePayment = async(req,res)=>{
  try {
    const {email , amount} = req.body;
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {email,amount:amount*100 }, //amount on kobo
      {headers:{Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`}}
);
    res.status(200).json({
      status:true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"payment initialization failed"});
  }
};

export const verifyPayment = async(req,res)=>{
  try {
    console.log("Verifying payment...");
    const { reference } = req.params;
    console.log("Reference:", reference);

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers:{ Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}
    }
);
    const data = response.data.data;
    console.log("Paystack verification data:", data);

      if(data.status === "success"){
        console.log("Payment successful. Updating user...");
        console.log("req.user:", req.user);
        const user = await User.findById(req.user._id);
        console.log("User before update:", user);
        user.isPremiumUser=true;
        await user.save();
        console.log("User after update:", user);

      return res.status(200).json({
      status:true,
      message:"payment verified successfully,User upgraded to premium",
      user,
    });
      } 
        res.status(400).json({
          status:false,
          message:"payment verification failed",
        });
      
     
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({message:"payment verification failed"});
}
}