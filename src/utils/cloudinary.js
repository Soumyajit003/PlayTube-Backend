import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localPath) => {
    try {
        if(!localPath) return null;
        //upload on Cloudinary
        const response = await cloudinary.uploader.upload(localPath,{
            resource_type:"auto"
        })
        // file has been uploaded successfully
        console.log("File is successfully uploaded on Cloudinary...",response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localPath); //it will remove the file from the locally stored temporary file if file upload got failled
    }
}

export {uploadOnCloudinary};