"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ImageOff } from "lucide-react";
import { bgReplace } from "../../../server/bg-replace";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

function BgReplace() {
  const generating = useImageStore((state) => state.generating);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const [prompt, setPrompt] = useState("");

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            BG Replace <ImageOff size={20} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Generative Background Replace
            </h4>
            <p className="text-sm text-muted-foreground">
              Replace the background of your image with AI-generated content.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                className="col-span-2 h-8"
                value={prompt}
                name="prompt"
                placeholder="Describe the new background"
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full mt-4"
          disabled={!activeLayer?.url || generating}
          onClick={async () => {
            setGenerating(true);
            const res = await bgReplace({
              activeImage: activeLayer.url!,
              prompt: prompt,
            });
            if (res?.data?.success) {
              setGenerating(false);

              const newLayerId = crypto.randomUUID();
              addLayer({
                id: newLayerId,
                url: res.data.success,
                format: activeLayer.format,
                height: activeLayer.height,
                width: activeLayer.width,
                name: "bgReplaced" + activeLayer.name,
                publicId: activeLayer.publicId,
                resourceType: "image",
              });
              setActiveLayer(newLayerId);
            }
            if (res?.serverError) setGenerating(false);
          }}
        >
          {generating ? "Generating..." : "Replace Background"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default BgReplace;
