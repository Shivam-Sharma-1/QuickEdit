"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Image, Sparkles } from "lucide-react";
import { bgRemove } from "../../../server/bg-remove";
import { toast } from "sonner";

function BgRemove() {
  const generating = useImageStore((state) => state.generating);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const handleRemove = async () => {
    setGenerating(true);
    const res = await bgRemove({
      activeImage: activeLayer.url!,
      format: activeLayer.format!,
      activeImageName: activeLayer.name!,
    });

    if (res?.data?.success) {
      setGenerating(false);
      const newLayerId = crypto.randomUUID();
      addLayer({
        id: newLayerId,
        url: res.data.success.secure_url,
        format: "png",
        height: activeLayer.height,
        width: activeLayer.width,
        name: "bgremoved-" + activeLayer.name,
        publicId: res.data.success.public_id,
        resourceType: "image",
      });
      setActiveLayer(newLayerId);
      toast.success("Background removed successfully");
    }
    if (res?.serverError) {
      setGenerating(false);
      toast.error("Background removal failed");
      console.error("Error in Background Removal process:", res.serverError);
    }
  };

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            BG Removal <Image size={20} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-6" side="right" sideOffset={16}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">BG Removal</h4>
            <p className="text-sm text-muted-foreground">
              Remove the background of an image.
            </p>
          </div>
        </div>
        <Button
          className="w-full mt-4 flex items-center justify-center gap-2"
          disabled={!activeLayer?.url || generating}
          onClick={handleRemove}
        >
          {generating ? "Removing..." : "Remove Background"}
          <Sparkles size={16} />
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default BgRemove;
