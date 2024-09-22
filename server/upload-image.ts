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

const uploadModifiedImageSchema = z.object({
  activeImageName: z.string(),
  removeUrl: z.string(),
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
            unique_filename: true,
            filename_override: file.name,
            secure: true,
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

export const uploadModifiedImage = actionClient
  .schema(uploadModifiedImageSchema)
  .action(async ({ parsedInput: { activeImageName, removeUrl } }) => {
    const result = await cloudinary.uploader.upload(removeUrl, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      use_filename: true,
      unique_filename: true,
      filename_override: activeImageName,
      secure: true,
    });

    return { result };
  });
