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

const bgReplaceSchema = z.object({
  activeImage: z.string(),
  prompt: z.string(),
  activeImageName: z.string(),
});

export const bgReplace = actionClient
  .schema(bgReplaceSchema)
  .action(async ({ parsedInput: { activeImage, prompt, activeImageName } }) => {
    const parts = activeImage.split("/upload/");
    try {
      const bgReplaceUrl = prompt
        ? `${parts[0]}/upload/e_gen_background_replace:prompt_${prompt}/${parts[1]}`
        : `${parts[0]}/upload/e_gen_background_replace/${parts[1]}`;

      let isProcessed = false;
      const maxAttempts = 20;
      const delay = 1000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        isProcessed = await checkImageProcessing(bgReplaceUrl);
        if (isProcessed) break;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if (!isProcessed) throw new Error("image processing timeout out");

      const uploadResult = await uploadModifiedImage({
        activeImageName: "bgreplaced-" + activeImageName,
        removeUrl: bgReplaceUrl,
      });

      return { success: uploadResult?.data?.result };
    } catch (error) {
      console.error("Error in Object Removal process:", error);
      return {
        error:
          "Error in Object Removal process: " +
          String((error as any).error.message),
      };
    }
  });
