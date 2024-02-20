"use client";
export default async function downloadImg(url: string) {
    try {

        const response = await fetch(url)
        const file = await response.blob()
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'felix_image.png';
        link.click();
    }
    catch (e) {
        console.log(e)
    }
}