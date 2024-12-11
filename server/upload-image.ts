"use server";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { z } from "zod";
import { prisma } from "../prisma/prisma";

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
    const session = await auth();

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
            folder: `quickedit/${session?.user?.id}`,
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
      console.error("Error uploading file:", error);
      return { error: "Upload failed: " + error };
    }
  });

export const uploadModifiedImage = actionClient
  .schema(uploadModifiedImageSchema)
  .action(async ({ parsedInput: { activeImageName, removeUrl } }) => {
    const session = await auth();

    const result = await cloudinary.uploader.upload(removeUrl, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      use_filename: true,
      unique_filename: true,
      filename_override: activeImageName,
      secure: true,
      folder: `quickedit/${session?.user?.id}/modified`,
    });

    return { result };
  });

interface NewData {
  public_id: string;
  format: string;
  resource_type: string;
  url: string;
  width: number;
  height: number;
  original_filename: string;
}

interface UploadImageToDBParams {
  newData: NewData;
  layerId: string;
}

export const uploadImageToDB = async ({
  newData,
  layerId,
}: UploadImageToDBParams): Promise<void> => {
  try {
    const session = await auth();

    await prisma.layer.upsert({
      where: {
        publicId: newData.public_id,
      },
      update: {
        userId: session?.user?.id!,
        publicId: newData.public_id,
        format: newData.format,
        resourceType: newData.resource_type,
        url: newData.url,
        width: newData.width,
        height: newData.height,
        name: newData.original_filename,
      },
      create: {
        userId: session?.user?.id!,
        publicId: newData.public_id,
        format: newData.format,
        resourceType: newData.resource_type,
        url: newData.url,
        width: newData.width,
        height: newData.height,
        name: newData.original_filename,
        layerId: layerId,
      },
    });
  } catch (error) {
    console.error("Error uploading image to DB:", error);
  }
};
