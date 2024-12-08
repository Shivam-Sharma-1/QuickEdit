"use server";

import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { prisma } from "../prisma/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteSchema = z.object({
  publicId: z.string(),
  resourceType: z.enum(["image", "video"]).optional().default("image"),
});

export const deleteResource = actionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput: { publicId, resourceType } }) => {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
          publicId,
          { resource_type: resourceType },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      return { success: result };
    } catch (error) {
      return {
        error:
          (error as Error).message ||
          "An error occurred while deleting the resource",
      };
    }
  });

export const deleteImageFromDB = async (layerId: string) => {
  try {
    await prisma.layer.delete({
      where: {
        layerId,
      },
    });
  } catch (error) {
    console.error("Error in deleting image from DB:", error);
    return { error: "Error in deleting image from DB" };
  }
};
