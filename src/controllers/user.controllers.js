import {User} from "../models/user.models.js";
import {uploadCloudinary} from "../utils/uploadCloudinary.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
const userRegister=asyncHandler(async(req,res)=>{
    const{userName,password,phoneNumber,email}=req.body;
    
if([userName,password,phoneNumber,email].some((field)=>!field?.trim().toLowerCase())){
    throw new ApiError(400,"required fields are empty");
}
const existedUser=await User.findOne(
    {$or:[{userName},{phoneNumber},{email}]}
);
if(existedUser){
    throw new ApiError(401,"user already exist");
}
const profilePath=req.files?.profile?.[0]?.path;
if(!profilePath){
    throw new ApiError(400,"profile required");
}

const profile=await uploadCloudinary(profilePath);

if(!profile){
    throw new ApiError(400,"upload at cloudinary failed");
}
const user=await User.create({
    userName,
    email,
    phoneNumber,
    password,
    profileImg:profile
})
const createdUser=await User.findById(user._id).select("-password");
if(!createdUser){
    throw new ApiError(500,"something went wrong ");
}

res.status(201)
.json(new ApiResponse(201,createdUser,"user created successfully"));

});

const userLogin=asyncHandler(async(req,res)=>{
    const{userName,password}=req.body;
    if(!userName || !password){
        throw new ApiError(400,"username and password are required");
    }
    const user=await User.findOne({userName});
    if(!user){
        throw new ApiError(404,"user not found");
    }
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"invalid credentials");
    }
    const token=user.generateAccessToken();
    const loggedInUser=await User.findById(user._id).select("-password");
    res.status(200)
    .json(new ApiResponse(200,{user:loggedInUser,token},"user logged in successfully"));
});


const userLogout=asyncHandler(async(req,res)=>{
    res.clearCookie("token",{httpOnly:true,secure:true});
    res.status(200)
    .json(new ApiResponse(200,null,"user logged out successfully"));
    console.log("user logged out successfully");
})
const updateuserName=asyncHandler(async(req,res)=>{
    const {userName}=req.body;
    if(!userName){
        throw new ApiError(400,"username is required");
    }
    const user=await User.findByIdAndUpdate(req.user?._id,{
            $set: {
                userName
            }
        },{new:true}).select("-password");
        console.log(user);
        return res.status(200).json(new ApiResponse(200,user,"username updated successfully"));
    });

    const updatePassword=asyncHandler(async(req,res)=>{
        const {oldPassword,newPassword}=req.body;
        if(!oldPassword || !newPassword){
            throw new ApiError(400,"old password and new password are required");
        }
        const user=await User.findById(req.user?._id,{
           
        $set: {
            password:newPassword
            }
        },{new:true}).select("-password");
        
        return res.status(200).json(new ApiResponse(200,user,"password updated successfully"));
    });

export {userRegister,userLogin,userLogout,updateuserName,updatePassword};




