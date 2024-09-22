"use server";

import checkImageProcessing from "@/lib/check-processing";
import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { uploadModifiedImage } from "./upload-image";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const bgRemoveSchema = z.object({
  activeImage: z.string(),
  format: z.string(),
  activeImageName: z.string(),
});

export const bgRemove = actionClient
  .schema(bgRemoveSchema)
  .action(async ({ parsedInput: { activeImage, format, activeImageName } }) => {
    try {
      const form = activeImage.split(format);
      const pngConvert = form[0] + "png";
      const parts = pngConvert.split("/upload/");
      const removeUrl = `${parts[0]}/upload/e_background_removal/${parts[1]}`;

      let isProcessed = false;
      const maxAttempts = 20;
      const delay = 1000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        isProcessed = await checkImageProcessing(removeUrl);
        if (isProcessed) break;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if (!isProcessed) throw new Error("Image processing timeout out");

      const uploadResult = await uploadModifiedImage({
        activeImageName: "bgremoved-" + activeImageName,
        removeUrl: removeUrl,
      });

      return { success: uploadResult?.data?.result };
    } catch (error) {
      console.error("Error in Background Removal process:", error);
      return {
        error:
          "Error in Background Removal process: " +
          String((error as any).error.message),
      };
    }
  });
