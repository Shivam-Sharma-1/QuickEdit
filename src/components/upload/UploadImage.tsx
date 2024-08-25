"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { uploadImage } from "../../../server/upload-image";
import { cn } from "@/lib/utils";

function UploadImage() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
    },
    onDrop: async (acceptFiles, fileRejections) => {
      if (acceptFiles.length > 0) {
        const formData = new FormData();
        formData.append("image", acceptFiles[0]);
        const objectUrl = URL.createObjectURL(acceptFiles[0]);
        const res = await uploadImage({ image: formData });
        console.log(res);
        console.log("uploading image");
      }
    },
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all  ease-in-out",
        `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
      )}
    >
      <CardContent className="flex flex-col h-full items-center justify-center px-2 py-24 text-xs">
        <input {...getInputProps()} />
        <div className="flex items-center flex-col justify-center gap-4">
          <p className="text-muted-foreground text-2xl">
            {isDragActive
              ? "Drop your image here!"
              : "Start by uploading an image"}
          </p>
          <p className="text-muted-foreground">
            Supported formats .jpeg .jpg .webp . png
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default UploadImage;
