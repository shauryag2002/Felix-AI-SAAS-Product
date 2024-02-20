"use server"
import { RemoveBgResult, RemoveBgError, removeBackgroundFromImageUrl } from "remove.bg";
import cloudinary from "cloudinary";
const outputFile = `.\\public\\RemoveBG\\${Date.now()}.png`;
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const removeBG = async (url: string) => {
    return await removeBackgroundFromImageUrl({
        url,
        apiKey: process.env.REMOVE_BG_API_KEY ?? "",
        size: "regular",
        type: "person",
        outputFile
    }).then(async (result: RemoveBgResult) => {

        const cloudinaryResult = await cloudinary.v2.uploader.upload(outputFile, { folder: "FELIX_removedBG_images" });

        return cloudinaryResult.secure_url;
    }).catch((errors: Array<RemoveBgError>) => {
        console.log(JSON.stringify(errors));
    })
};

export default removeBG;