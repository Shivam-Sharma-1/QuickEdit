"use server";

import checkImageProcessing from "@/lib/check-processing";
import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractPartSchema = z.object({
  activeImage: z.string(),
  prompts: z.array(z.string()),
  multiple: z.boolean().optional(),
  mode: z.enum(["default", "mask"]).optional(),
  invert: z.boolean().optional(),
  format: z.string(),
});

export const extractPart = actionClient
  .schema(extractPartSchema)
  .action(
    async ({
      parsedInput: { activeImage, format, prompts, multiple, mode, invert },
    }) => {
      const form = activeImage.split(format);
      const pngConvert = form[0] + "png";
      const parts = pngConvert.split("/upload/");

      let extractParams = `prompt_(${prompts
        .map((p) => encodeURIComponent(p))
        .join(";")})`;
      if (multiple) extractParams += ";multiple_true";
      if (mode === "mask") extractParams += ";mode_mask";
      if (invert) extractParams += ";invert_true";

      const extractUrl = `${parts[0]}/upload/e_extract:${extractParams}/${parts[1]}`;

      let isProcessed = false;
      const maxAttempts = 20;
      const delay = 1000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        isProcessed = await checkImageProcessing(extractUrl);
        if (isProcessed) break;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if (!isProcessed) throw new Error("image processing timeout out");
      return { success: extractUrl };
    }
  );
