"use server";

import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formData = z.object({
  image: z.instanceof(FormData),
});

type UploadResult =
  | { success: UploadApiResponse; error?: never }
  | { success?: never; error: string };

export const uploadImage = actionClient
  .schema(formData)
  .action(async ({ parsedInput: { image } }): Promise<UploadResult> => {
    const formImage = image.get("image");

    if (!formImage || !image) return { error: "No image provided" };

    const file = formImage as File;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            use_filename: true,
            unique_filename: false,
            filename_override: file.name,
          },
          (error, result) => {
            if (error || !result) {
              console.error("Upload failed:", error);
              reject({ error: "Upload failed:" });
            } else {
              console.log("Upload successful:", result);
              resolve({ success: result });
            }
          }
        );
        uploadStream.end(buffer);
      });
    } catch (error) {
      console.error("Error processing file:", error);
      return { error: "Upload failed: " + error };
    }
  });
