"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Image } from "lucide-react";
import { bgRemove } from "../../../server/bg-remove";

function BgRemove() {
  const tags = useImageStore((state) => state.tags);
  const generating = useImageStore((state) => state.generating);
  const activeColor = useImageStore((state) => state.activeColor);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            BG Removal <Image size={20} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">BG Removal</h4>
            <p className="text-sm text-muted-foreground">
              Remove the background of an image.
            </p>
          </div>
        </div>
        <Button
          className="w-full mt-4"
          disabled={!activeLayer?.url || generating}
          onClick={async () => {
            setGenerating(true);
            const res = await bgRemove({
              activeImage: activeLayer.url!,
              format: activeLayer.format!,
            });
            if (res?.data?.success) {
              setGenerating(false);

              const newLayerId = crypto.randomUUID();
              addLayer({
                id: newLayerId,
                url: res.data.success,
                format: "png",
                height: activeLayer.height,
                width: activeLayer.width,
                name: "bgRemoved" + activeLayer.name,
                publicId: activeLayer.publicId,
                resourceType: "image",
              });
              setActiveLayer(newLayerId);
            }
            if (res?.serverError) setGenerating(false);
          }}
        >
          {generating ? "Removing..." : "Remove Background"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default BgRemove;