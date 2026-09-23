import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({quiet:true});
// Added quiet:true to remove the message with the server starts
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;
