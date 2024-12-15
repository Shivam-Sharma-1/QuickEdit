"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { uploadImage, uploadImageToDB } from "../../../server/upload-image";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useResponsive } from "@/lib/hooks/useResponsive";

function UploadImage() {
  const setTags = useImageStore((state) => state.setTags);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const updateLayer = useLayerStore((state) => state.updateLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

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
        setGenerating(true);

        try {
          const res = await uploadImage({ image: formData });

          if (res?.data?.success) {
            const newData = res?.data?.success;
            await uploadImageToDB({ newData, layerId: activeLayer.id });

            updateLayer({
              id: activeLayer.id,
              url: newData.url,
              width: newData.width,
              height: newData.height,
              name: newData.original_filename,
              publicId: newData.public_id,
              format: newData.format,
              resourceType: newData.resource_type,
            });
            setTags(newData.tags);
            setActiveLayer(activeLayer.id);
            setGenerating(false);
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(`Image Upload failed, ${error.message}`);
            console.error("Error in Image Upload process:", error.message);
          }
        } finally {
          setGenerating(false);
        }

        // updateLayer({
        //   id: activeLayer.id,
        //   url: objectUrl,
        //   width: 0,
        //   height: 0,
        //   name: "Uploading ...",
        //   publicId: "",
        //   format: "",
        //   resourceType: "image",
        // });
      }

      if (fileRejections.length) {
        toast.error("Please upload a valid image file");
      }
    },
  });

  const isMobile = useResponsive(768);

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "hover:cursor-pointer hover:bg-[#0d1c41] hover:border-primary transition-all ease-in-out",
        `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
      )}
    >
      <CardContent className="flex flex-col h-full items-center justify-center px-2 pb-6 md:py-20 text-xs">
        <input {...getInputProps()} />
        <div className="flex items-center flex-col justify-center gap-4">
          <DotLottieReact
            src="https://lottie.host/30e9f05e-3210-4c2e-8ba9-922adcd19e68/GYV05tEM5s.lottie"
            loop
            autoplay
            style={{
              width: isMobile ? 200 : 300,
              height: isMobile ? 200 : 300,
              objectFit: "contain",
            }}
          />
          <p className="text-muted-foreground text-xl md:text-2xl">
            {isDragActive
              ? "Drop your image here!"
              : "Start by uploading an image"}
          </p>
          <p className="text-muted-foreground">
            Supported formats: .jpeg .jpg .webp .png
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default UploadImage;
