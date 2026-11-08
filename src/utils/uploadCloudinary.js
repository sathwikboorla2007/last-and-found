import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
cloud_name:process.env.CLOUD_NAME, 
api_key:process.env.CLOUD_API_KEY, 
api_secret:process.env.CLOUD_SECRET_KEY
});

const uploadCloudinary=async (LocalFilePath)=>{
    try{
        if(!LocalFilePath) return;

        const response =await cloudinary.uploader.upload(LocalFilePath, {
                        resource_type: "auto", 
                        
    })
return response.secure_url;}
    catch(error){
        fs.unlinkSync(LocalFilePath);
        console.error("Cloudinary upload error:", error.message);
        return null;
    }


    
}
export {uploadCloudinary};