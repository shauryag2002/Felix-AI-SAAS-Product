"use server"
import { RemoveBgResult, RemoveBgError, removeBackgroundFromImageUrl } from "remove.bg";
import cloudinary from "cloudinary";
import path from "path";
import fs from "fs";
// const outputFile = `.\\public\\RemoveBG\\${Date.now()}.png`;
const outputFile = path.join(__dirname, `./public/RemoveBG/${Date.now()}.png`);
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
interface CloudinaryError {
    message: string;
    http_code: number;
}

interface CloudinaryResult {
    secure_url: string;
    public_id: string;
}
const saveBase64ImageToCloudinary = async (base64Image: string) => {
    return new Promise<string | null>((resolve, reject) => {
        try {
            // Decode the base64 image into binary data
            const binaryData = Buffer.from(base64Image, "base64");

            // Upload the binary data to Cloudinary
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { folder: "FELIX_base64_images" },
                (error: CloudinaryError | undefined, result: CloudinaryResult | undefined) => {
                    if (error) {
                        console.error("Error uploading image to Cloudinary:", error);
                        reject(error);
                    } else {
                        resolve(result?.secure_url ?? "");
                    }
                }
            );
            uploadStream.end(binaryData);
        } catch (error) {
            console.error("Error saving base64 image to Cloudinary:", error);
            reject(error);
        }
    });
};
const removeBG = async (url: string) => {
    try {
        // Remove background from the image URL using Remove.bg API
        const removeBgResult: RemoveBgResult = await removeBackgroundFromImageUrl({
            url,
            apiKey: process.env.REMOVE_BG_API_KEY ?? "",
            size: "regular",
            type: "person"
            // , outputFile
        });
        return await saveBase64ImageToCloudinary(removeBgResult.base64img).then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
        console.log("Removed background from image:", removeBgResult.base64img);
        // Upload the resulting image to Cloudinary
        // const cloudinaryResult = await cloudinary.v2.uploader.upload(removeBgResult.base64img, { folder: "FELIX_removedBG_images" });
        // console.log("Uploaded to Cloudinary:", cloudinaryResult.secure_url);
        // fs.unlinkSync(outputFile);
        return null;
        // return cloudinaryResult.secure_url;
    } catch (error) {
        console.error("Error removing background or uploading to Cloudinary:", error);
        return null;
    }
};

export default removeBG;