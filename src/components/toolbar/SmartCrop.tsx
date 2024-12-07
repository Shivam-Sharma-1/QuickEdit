import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Crop, ScanFace, Sparkles, Square } from "lucide-react";
import { useLayerStore } from "@/lib/layer-store";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/lib/image-store";
import Youtube from "../icons/Youtube";
import TikTok from "../icons/TikTok";
import { genCrop } from "../../../server/smart-crop";

export default function SmartCrop() {
  const { setGenerating, generating } = useImageStore((state) => ({
    setGenerating: state.setGenerating,
    generating: state.generating,
  }));
  const { activeLayer, addLayer, setActiveLayer } = useLayerStore((state) => ({
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    setActiveLayer: state.setActiveLayer,
  }));
  const [aspectRatio, setAspectRatio] = useState("16:9");

  const handleGenCrop = async () => {
    setGenerating(true);
    const res = await genCrop({
      height: activeLayer.height!.toString(),
      aspect: aspectRatio,
      activeVideo: activeLayer.url!,
      activeVideoName: activeLayer.name!,
    });

    if (res?.data?.success) {
      setGenerating(false);
      const newLayerId = crypto.randomUUID();
      // const { secure_url, public_id } = await res.data.success;
      // const thumbnailUrl = secure_url.replace(/\.[^/.]+$/, ".jpg");
      const newData = res?.data.success;
      const videoUrl = res?.data.cropUrl;
      const thumbnailUrl = res?.data.cropUrl.replace(/\.[^/.]+$/, ".jpg");

      console.log("Video cropped successfully", newData);

      addLayer({
        id: newLayerId,
        name: "cropped-" + activeLayer.name,
        format: activeLayer.format,
        height: newData.height!,
        width: newData.width!,
        url: videoUrl,
        publicId: newData.public_id,
        resourceType: "video",
        poster: thumbnailUrl,
      });
      toast.success("Video cropped successfully");
      setActiveLayer(newLayerId);
    }
    if (res?.data?.error) {
      setGenerating(false);
      toast.error("Video cropped failed");
      console.error("Error in Video crop process:", res.serverError);
    }
  };

  const demo = {
    state: {
      layers: [
        {
          id: "1e420741-afe5-4ea2-9ca8-e2403b3c1a40",
          url: "http://res.cloudinary.com/dqiqi75hm/image/upload/v1733562668/Logo1_dc9xtk.png",
          width: 937,
          height: 937,
          name: "Logo1",
          publicId: "Logo1_dc9xtk",
          format: "png",
          resourceType: "image",
        },
        {
          id: "546793f3-eafe-4026-832b-14e7eda2cd9a",
          url: "http://res.cloudinary.com/dqiqi75hm/image/upload/v1733565577/sample_vnhq8v.jpg",
          width: 864,
          height: 576,
          name: "sample",
          publicId: "sample_vnhq8v",
          format: "jpg",
          resourceType: "image",
        },
        {
          id: "cdeea03d-1890-46ed-8f61-943b559f6ce0",
          url: "https://res.cloudinary.com/dqiqi75hm/image/upload/v1733565599/genremove-sample_dzqv9u.jpg",
          format: "jpg",
          height: 576,
          width: 864,
          name: "genremove-sample",
          publicId: "genremove-sample_dzqv9u",
          resourceType: "image",
        },
        {
          id: "ee6856ee-f617-4fba-8721-c673d3e42858",
          url: "https://res.cloudinary.com/dqiqi75hm/image/upload/v1733566271/bgremoved-sample_tektv0.png",
          format: "png",
          height: 576,
          width: 864,
          name: "bgremoved-sample",
          publicId: "bgremoved-sample_tektv0",
          resourceType: "image",
        },
        {
          id: "2a8bb427-52d0-4b49-9aa4-7aa8ff9a8586",
          url: "https://res.cloudinary.com/dqiqi75hm/image/upload/v1733566379/bgreplaced-sample_yjehb2.jpg",
          format: "jpg",
          height: 576,
          width: 864,
          name: "bgreplaced-sample",
          publicId: "bgreplaced-sample_yjehb2",
          resourceType: "image",
        },
        {
          id: "0ac8c522-2339-4fce-895d-afce5dd15e95",
          name: "genfill-bgreplaced-sample",
          format: "jpg",
          height: 576,
          width: 1334,
          url: "https://res.cloudinary.com/dqiqi75hm/image/upload/v1733566452/genfill-bgreplaced-sample_cwyzhh.jpg",
          publicId: "genfill-bgreplaced-sample_cwyzhh",
          resourceType: "image",
        },
        {
          id: "abf66e21-bc25-44e0-8ab3-646e68ae6a43",
          name: "extracted-genfill-bgreplaced-sample",
          format: ".png",
          height: 576,
          width: 1334,
          url: "https://res.cloudinary.com/dqiqi75hm/image/upload/v1733566531/extracted-genfill-bgreplaced-sample_quriu9.png",
          publicId: "extracted-genfill-bgreplaced-sample_quriu9",
          resourceType: "image",
        },
        {
          id: "5fe3f669-a344-4181-b51f-a0ac12e199b4",
          url: "http://res.cloudinary.com/dqiqi75hm/video/upload/v1733570214/Sidebar.._xu5o1g.mp4",
          width: 1280,
          height: 720,
          name: "Sidebar..",
          publicId: "Sidebar.._xu5o1g",
          format: "mp4",
          poster:
            "http://res.cloudinary.com/dqiqi75hm/video/upload/v1733570214/Sidebar.._xu5o1g.jpg",
          resourceType: "video",
        },
        {
          id: "224b787e-05ac-4557-b362-3f64b39bd576",
          name: "cropped-Sidebar..",
          format: "mp4",
          height: 720,
          width: 720,
          url: "http://res.cloudinary.com/dqiqi75hm/video/upload/ar_1:1,c_fill,g_auto,h_720/v1733570214/Sidebar.._xu5o1g.mp4",
          publicId: "cropped-Sidebar.._tmez4y",
          resourceType: "video",
          poster:
            "http://res.cloudinary.com/dqiqi75hm/video/upload/ar_1:1,c_fill,g_auto,h_720/v1733570214/Sidebar.._xu5o1g.jpg",
        },
      ],
      activeLayer: {
        id: "224b787e-05ac-4557-b362-3f64b39bd576",
        name: "cropped-Sidebar..",
        format: "mp4",
        height: 720,
        width: 720,
        url: "http://res.cloudinary.com/dqiqi75hm/video/upload/ar_1:1,c_fill,g_auto,h_720/v1733570214/Sidebar.._xu5o1g.mp4",
        publicId: "cropped-Sidebar.._tmez4y",
        resourceType: "video",
        poster:
          "http://res.cloudinary.com/dqiqi75hm/video/upload/ar_1:1,c_fill,g_auto,h_720/v1733570214/Sidebar.._xu5o1g.jpg",
      },
      layerComparisonMode: false,
      comparedLayers: [],
    },
    version: 0,
  };
  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center  flex-col text-xs font-medium">
            Smart Crop
            <Crop size={18} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-6" side="right" sideOffset={16}>
        <div className="flex flex-col h-full">
          <div className="space-y-2 pb-4">
            <h3 className="font-medium text-center py-2 leading-none">
              Smart Recrop
            </h3>
          </div>
          <h4 className="text-md font-medium pb-2">Format</h4>
          <div className={"flex gap-4 items-center justify-center pb-2"}>
            <Card
              className={cn(
                aspectRatio === "16:9" ? " border-primary" : "",
                "p-4 w-36 cursor-pointer"
              )}
              onClick={() => setAspectRatio("16:9")}
            >
              <CardHeader className="text-center p-0">
                <CardTitle className="text-md">Youtube</CardTitle>
                <CardDescription className="text-sm font-bold">
                  16:9
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 pt-2">
                <Youtube />
              </CardContent>
            </Card>
            <Card
              className={cn(
                aspectRatio === "9:16" ? " border-primary" : "",
                "p-4 w-36 cursor-pointer"
              )}
              onClick={() => setAspectRatio("9:16")}
            >
              <CardHeader className="p-0 text-center">
                <CardTitle className="text-md ">Tiktok</CardTitle>
                <CardDescription className="text-sm font-bold">
                  9:16
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 pt-2">
                <TikTok />
              </CardContent>
            </Card>
            <Card
              className={cn(
                aspectRatio === "1:1" ? " border-primary" : "",
                "p-4 w-36 cursor-pointer"
              )}
              onClick={() => setAspectRatio("1:1")}
            >
              <CardHeader className="p-0 text-center">
                <CardTitle className="text-md">Square</CardTitle>
                <CardDescription className="text-sm font-bold">
                  1:1
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 pt-2">
                <Square className="w-10 h-10" />
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleGenCrop}
            className="w-full mt-4 flex items-center justify-center gap-2"
            disabled={!activeLayer.url || generating}
          >
            {generating ? "Cropping..." : "Smart Crop"}
            <Sparkles size={16} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
