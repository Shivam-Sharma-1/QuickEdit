"use server";

import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary } from "cloudinary";
import z from "zod";
import { uploadModifiedVideo } from "./upload-video";
import { waitForProcessing } from "@/lib/wait-processing";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genFillSchema = z.object({
  activeVideo: z.string(),
  aspect: z.string(),
  height: z.string(),
  activeVideoName: z.string(),
});

export const genCrop = actionClient
  .schema(genFillSchema)
  .action(
    async ({
      parsedInput: { activeVideo, aspect, height, activeVideoName },
    }) => {
      try {
        const parts = activeVideo.split("/upload/");
        const cropUrl = `${parts[0]}/upload/ar_${aspect},c_fill,g_auto,h_${height}/${parts[1]}`;

        const isProcessed = await waitForProcessing(cropUrl);

        if (!isProcessed)
          throw new Error("Video processing timed out! Use a smaller video.");

        const uploadResult = await uploadModifiedVideo({
          activeVideoName: "cropped-" + activeVideoName,
          removeUrl: cropUrl,
        });

        if (!uploadResult) {
          return { error: "Error in uploading modified video" };
        }

        return { success: uploadResult?.data?.result, cropUrl: cropUrl };
      } catch (error) {
        console.error("Error in video cropping process:", error);
        return {
          error:
            "Error in video cropping process: " +
            String((error as any).message),
        };
      }
    }
  );
