import {User} from "../models/user.models.js";
import {uploadCloudinary} from "../utils/uploadCloudinary.js";

const userRegister=asyncHandler(async(req,res)=>{
    const{userName,password,rollNo,phoneNumber,email}=req.body;
if([userName,password,rollNo,phoneNumber].some((field)=>!field?.trim==="")){
    throw new ApiError(400,"required fields are empty");
}
const existedUser=await User.findOne(
    {$or:[{userName},{rollNo},{phoneNumber},{email}]}
);
if(existedUser){
    throw new ApiError(401,"user already exist");
}
const profilePath=req.files?.profile?.[0]?.path;
if(!profilePath){
    throw new ApiError(400,"profile required");
}

const profile=uploadCloudinary(profilePath);

if(!profile){
    throw new ApiError(400,"upload at cloudinary failed");
}
const user=await User.create({
    userName,
    email,
    rollNo,
    phoneNumber,
    password,
    profile:profile
})
const createdUser=await User.findById(user._id).select("-password");
if(!createdUser){
    throw new ApiError(500,"something went wrong ");
}

res.send.status(201)
.json(new ApiResponse(400,createdUser,"user created successfully"));

});

export {userRegister};






