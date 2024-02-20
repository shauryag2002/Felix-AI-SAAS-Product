import { v2 } from "cloudinary"
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const saveImage = (filePath: string) => {

    v2.uploader.upload(filePath, { folder: "FELIX_Prompt_images" })
        .then(result => {
            return result.url
        })
        .catch(error => console.error(error));
    return ""
}