"use server";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import z from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formData = z.object({
  video: z.instanceof(FormData),
});

const uploadModifiedImageVideo = z.object({
  activeVideoName: z.string(),
  removeUrl: z.string(),
});

type UploadResult =
  | { success: UploadApiResponse; error?: never }
  | { error: string; success?: never };

export const uploadVideo = actionClient
  .schema(formData)
  .action(async ({ parsedInput: { video } }): Promise<UploadResult> => {
    const formVideo = video.get("video");

    if (!formVideo) return { error: "No video provided" };
    if (!video) return { error: "No video provided" };

    const file = formVideo as File;

    try {
      const session = await auth();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            use_filename: true,
            unique_filename: true,
            filename_override: file.name,
            secure: true,
            folder: `quickedit/${session?.user?.id}`,
          },
          (error, result) => {
            if (error || !result) {
              console.error("Upload failed:", error);
              reject({ error: "Upload failed" });
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
      return { error: "Error processing file" };
    }
  });

export const uploadModifiedVideo = actionClient
  .schema(uploadModifiedImageVideo)
  .action(async ({ parsedInput: { activeVideoName, removeUrl } }) => {
    try {
      const session = await auth();

      const result = await cloudinary.uploader.upload(removeUrl, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        use_filename: true,
        unique_filename: true,
        filename_override: activeVideoName,
        resource_type: "video",
        secure: true,
        folder: `quickedit/${session?.user?.id}/modified`,
      });

      return { result };
    } catch (error) {
      console.error("Error smatrcrop uploading modified video:", error);
    }
  });
