"use client";

import { User as UserData } from "@prisma/client";
import { Image, Sparkles, WandSparkles } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";



import { bgRemove } from "../../../server/bg-remove";
import checkBgRemoval from "../../../server/check-bgRemoval";
import decreaseCredits from "../../../server/decrease-credits";
import { uploadImageToDB } from "../../../server/upload-image";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";


function BgRemove({ user, userData }: { user: User; userData: UserData }) {
  const { generating, setGenerating } = useImageStore((state) => ({
    generating: state.generating,
    setGenerating: state.setGenerating,
  }));
  const { activeLayer, addLayer, setActiveLayer } = useLayerStore((state) => ({
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    setActiveLayer: state.setActiveLayer,
  }));

  console.log("userData", userData);

  const handleRemove = async () => {
    setGenerating(true);

    try {
      const quotaExisting = await checkBgRemoval();
      if (quotaExisting) await decreaseCredits(12, user.email!);

      const res = await bgRemove({
        activeImage: activeLayer.url!,
        format: activeLayer.format!,
        activeImageName: activeLayer.name!,
      });

      if (res?.data?.success) {
        const newLayerId = crypto.randomUUID();
        const newData = res.data.success;

        await uploadImageToDB({
          newData: newData,
          layerId: newLayerId,
        });

        addLayer({
          id: newLayerId,
          url: res.data.success.secure_url,
          format: "png",
          height: newData.height,
          width: newData.width,
          name: "bgremoved-" + activeLayer.name,
          publicId: newData.public_id,
          resourceType: "image",
        });
        setActiveLayer(newLayerId);
        toast.success("Background removed successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Background removal failed, ${error.message}`);
        console.error("Error in Background Removal process:", error.message);
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
                <Image size={20} />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Background Removal
          </TooltipContent>
          <PopoverContent className="w-full p-6" side="right" sideOffset={16}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">BG Removal</h4>
                <p className="text-sm text-muted-foreground">
                  Remove the background of an image.
                </p>
              </div>
              <p className="text-xs flex  items-center gap-1">
                Costs: 12 Credits <Sparkles size={14} />
              </p>
            </div>
            {userData?.credits < 12 ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <Button
                      className="w-full mt-2 flex items-center justify-center gap-2"
                      disabled
                    >
                      Insufficient Credits <Sparkles size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={10}>
                    You need at least 12 credits to remove the background.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                className="w-full mt-2 flex items-center justify-center gap-2"
                disabled={
                  userData?.credits < 12 || !activeLayer?.url || generating
                }
                onClick={handleRemove}
              >
                {generating ? "Removing..." : "Remove Background"}
                <WandSparkles size={16} />
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
}

export default BgRemove;
