'use server';

import cloudinary from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary with environment variables

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.CLOUD_API_KEY as string,
    api_secret: process.env.CLOUD_API_SECRET as string,
  });


export const uploadImageToCloudinary = async (file: any): Promise<string | null> => {
    try {
        // Convert the file to a readable stream if it's a buffer
        const buffer = await file.arrayBuffer();
        const readableStream = Readable.from(Buffer.from(buffer));

        // Use Cloudinary's upload_stream to handle the upload
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { folder: 'bills_upload' },
                (error, result) => {
                    if (error) {
                        console.error("Error uploading to Cloudinary:", error);
                        reject(null);
                    } else {
                        console.log("Image URL:", result?.secure_url);
                        resolve(result?.secure_url || null);
                    }
                }
            );

            // Pipe the readable stream to Cloudinary
            readableStream.pipe(uploadStream);

            return true;
        });
    } catch (error) {
        console.error("Error converting file for Cloudinary upload:", error);
        return null;
    }
};
