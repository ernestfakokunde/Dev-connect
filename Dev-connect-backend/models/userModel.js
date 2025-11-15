import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username:{type:String, required:true, unique:true},
  email:{type:String, required:true,unique:true},
  password:{type:String, required:true},
  profileName:{type:String, default:""},
  profilePic:{type:String, default:""},
  town:{type:String,default:""},
  placeOfBirth:{type:String, default:""},
  bio:{type:String, default:""},
  gender:{type:String, default:""},
  isProfileCompleted:{type:Boolean, default:false},
  isPremiumUser:{type:Boolean, default:false},
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who sent me a request
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users I sent a request to
},{timestamps:true});

userSchema.pre('save', async function (next) {
  // If the password hasn't been modified, skip hashing and return early.
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
}); 

userSchema.methods.matchPassword = async function (enteredpassword) {
return await bcrypt.compare(enteredpassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;