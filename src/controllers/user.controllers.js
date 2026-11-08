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

    const changePassword=asyncHandler(async(req,res)=>{
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
    import { user } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const updateProfile = asyncHandler(async (req, res) => {

    // 1. Get the logged-in user's ID
    const userId = req.user._id;

    // 2. Extract fields from req.body
    const { name, email, phoneNumber } = req.body;

    // 3. Check whether at least one field was provided
    const hasProfileField =
        name !== undefined ||
        email !== undefined ||
        phoneNumber !== undefined;

    const hasProfileImage = Boolean(req.files?.profile?.[0]);

    if (!hasProfileField && !hasProfileImage) {
        throw new ApiError(400, "No fields provided for update");
    }

    // 4. Validate name if provided
    if (name !== undefined && !name.trim()) {
        throw new ApiError(400, "Name cannot be empty");
    }

    // 5. Validate email if provided
    if (email !== undefined) {
        if (!email.trim()) {
            throw new ApiError(400, "Email cannot be empty");
        }

        const existingEmail = await user.findOne({
            email: email.trim().toLowerCase(),
            _id: { $ne: userId }
        });

        if (existingEmail) {
            throw new ApiError(409, "Email already exists");
        }
    }

    // 6. Validate phone number if provided
    if (phoneNumber !== undefined) {
        if (!/^\d{10}$/.test(phoneNumber.trim())) {
            throw new ApiError(400, "Enter a valid 10-digit phone number");
        }

        const existingPhone = await user.findOne({
            phoneNumber: phoneNumber.trim(),
            _id: { $ne: userId }
        });

        if (existingPhone) {
            throw new ApiError(409, "Phone number already exists");
        }
    }

    // 7. Prepare update object
    const updateData = {};

    if (name !== undefined) {
        updateData.name = name.trim();
    }

    if (email !== undefined) {
        updateData.email = email.trim().toLowerCase();
    }

    if (phoneNumber !== undefined) {
        updateData.phoneNumber = phoneNumber.trim();
    }

    // 8. Upload profile image if provided
    if (hasProfileImage) {
        const profileLocalPath = req.files.profile[0].path;

        const profile = await uploadCloudinary(profileLocalPath);

        if (!profile?.secure_url) {
            throw new ApiError(500, "Profile image upload failed");
        }

        updateData.profileImg = profile.secure_url;
    }

    // 9. Update user
    const updatedUser = await user.findByIdAndUpdate(
        userId,
        { $set: updateData },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    
    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile updated successfully")
    );
});

export { updateProfile };

export {userRegister,userLogin,userLogout,changePassword,updateProfile};




