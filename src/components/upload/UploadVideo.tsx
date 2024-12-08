"use client";

import { useDropzone } from "react-dropzone";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { useLayerStore } from "@/lib/layer-store";
import * as videoAnimation from "../../../public/animations/video-upload.json";
import { useImageStore } from "@/lib/image-store";
import { uploadVideo } from "../../../server/upload-video";
import dynamic from "next/dynamic";

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

        const res = await uploadVideo({ video: formData });

        if (res?.data?.success) {
          const videoUrl = res.data.success.url;
          const thumbnailUrl = videoUrl.replace(/\.[^/.]+$/, ".jpg");
          updateLayer({
            id: activeLayer.id,
            url: res.data.success.url,
            width: res.data.success.width,
            height: res.data.success.height,
            name: res.data.success.original_filename,
            publicId: res.data.success.public_id,
            format: res.data.success.format,
            poster: thumbnailUrl,
            resourceType: res.data.success.resource_type,
          });
          setTags(res.data.success.tags);
          setActiveLayer(activeLayer.id);
          setGenerating(false);
        }
        if (res?.data?.error) {
          setGenerating(false);
        }
      }

      if (fileRejections.length) {
        console.log("rejected");
      }
    },
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all ease-in-out",
        `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
      )}
    >
      <CardContent className="flex flex-col h-full items-center justify-center px-2 py-24 text-xs">
        <input {...getInputProps()} />
        <div className="flex items-center flex-col justify-center gap-4">
          <Lottie className="h-48" animationData={videoAnimation} />
          <p className="text-muted-foreground text-2xl">
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
