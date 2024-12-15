import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Crop, ScanFace, Sparkles, Square, WandSparkles } from "lucide-react";
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
import { useSession } from "next-auth/react";
import decreaseCredits from "../../../server/decrease-credits";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { data: session } = useSession();

  const [aspectRatio, setAspectRatio] = useState("16:9");

  const handleGenCrop = async () => {
    setGenerating(true);

    try {
      await decreaseCredits(8, session?.user?.email!);

      const res = await genCrop({
        height: activeLayer.height!.toString(),
        aspect: aspectRatio,
        activeVideo: activeLayer.url!,
        activeVideoName: activeLayer.name!,
      });

      if (res?.data?.success) {
        const newLayerId = crypto.randomUUID();
        // const { secure_url, public_id } = await res.data.success;
        // const thumbnailUrl = secure_url.replace(/\.[^/.]+$/, ".jpg");
        const newData = res?.data.success;
        const videoUrl = res?.data.cropUrl;
        const thumbnailUrl = res?.data.cropUrl.replace(/\.[^/.]+$/, ".jpg");

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
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Video cropped failed, ${error.message}`);
        console.error("Error in Video crop process:", error.message);
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <Popover>
          <TooltipTrigger>
            <PopoverTrigger disabled={!activeLayer?.url} asChild>
              <Button variant="ghost" className="p-3 h-fit w-min">
                <Crop size={18} />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Smart Crop
          </TooltipContent>
          <PopoverContent className="w-full p-6" side="right" sideOffset={16}>
            <div className="flex flex-col h-full">
              <div className="space-y-2 pb-4">
                <h3 className="font-medium text-center py-2 leading-none">
                  Smart Recrop
                </h3>
                <p className="text-sm text-muted-foreground">
                  Smart crop the video to fit the aspect ratio.
                </p>
              </div>
              <h4 className="text-md font-medium pb-2">Format</h4>
              <div
                className={
                  "flex gap-4 items-center justify-center pb-2 flex-wrap"
                }
              >
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
              <p className="text-xs flex  items-center gap-1 mt-2">
                Costs: 8 Credits <Sparkles size={14} />
              </p>
              <Button
                onClick={handleGenCrop}
                className="w-full mt-2 flex items-center justify-center gap-2"
                disabled={!activeLayer.url || generating}
              >
                {generating ? "Cropping..." : "Smart Crop"}
                <WandSparkles size={16} />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
}
