"use client";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { useResponsive } from "@/lib/hooks/useResponsive";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";

import * as videoAnimation from "../../../public/animations/video-upload.json";
import { uploadVideo, uploadVideoToDB } from "../../../server/upload-video";
import { Card, CardContent } from "../ui/card";


export default function UploadVideo() {
  const setTags = useImageStore((state) => state.setTags);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const updateLayer = useLayerStore((state) => state.updateLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "video/mp4": [".mp4", ".MP4"],
    },

    onDrop: async (acceptedFiles, fileRejections) => {
      if (acceptedFiles.length) {
        const formData = new FormData();
        formData.append("video", acceptedFiles[0]);
        const objectUrl = URL.createObjectURL(acceptedFiles[0]);
        setGenerating(true);

        try {
          const res = await uploadVideo({ video: formData });

          if (res?.data?.success) {
            const newData = res?.data?.success;
            const videoUrl = newData.url;
            const thumbnailUrl = videoUrl.replace(/\.[^/.]+$/, ".jpg");
            await uploadVideoToDB({
              newData,
              layerId: activeLayer.id,
              thumbnailUrl,
              videoUrl,
            });

            updateLayer({
              id: activeLayer.id,
              url: newData.url,
              width: newData.width,
              height: newData.height,
              name: newData.original_filename,
              publicId: newData.public_id,
              format: newData.format,
              poster: thumbnailUrl,
              resourceType: newData.resource_type,
            });
            setTags(newData.tags);
            setActiveLayer(activeLayer.id);
            setGenerating(false);
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(`Video Upload failed, ${error.message}`);
            console.error("Error in Video Upload process:", error.message);
          }
        } finally {
          setGenerating(false);
        }
      }

      if (fileRejections.length) {
        toast.error("Please upload a valid video file");
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
      <CardContent className="flex flex-col h-full items-center justify-center px-2 pt-4 pb-6 md:py-20 text-xs">
        <input {...getInputProps()} />
        <div className="flex items-center flex-col justify-center gap-4">
          <DotLottieReact
            src="https://lottie.host/71d873ae-aee8-43a1-9d18-2009297f99b7/Ijxe9AlLzc.lottie"
            loop
            autoplay
            style={{
              width: isMobile ? 150 : 300,
              height: isMobile ? 150 : 300,
              objectFit: "contain",
            }}
          />
          <p className="text-muted-foreground text-xl md:text-2xl">
            {isDragActive
              ? "Drop your video here!"
              : "Start by uploading a video"}
          </p>
          <p className="text-muted-foreground">Supported Format: .mp4</p>
        </div>
      </CardContent>
    </Card>
  );
}
