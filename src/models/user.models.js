import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profileImg:{
        type:String
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
        required:true
    },
    password:{
        type:String,
        required:true
    },
     accountStatus: {
      type: String,
      enum: ["pending_verification", "active", "suspended"],
      default: "pending_verification",
      required: true,
    },

    campusVerificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      required: true,
    }

},
{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return;
    }
    this.password=await bcrypt.hash(this.password,10);
    
});
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User=mongoose.model("user",userSchema);