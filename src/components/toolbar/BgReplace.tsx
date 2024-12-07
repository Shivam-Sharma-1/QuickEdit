"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ImageOff, Sparkles } from "lucide-react";
import { bgReplace } from "../../../server/bg-replace";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

function BgReplace() {
  const { generating, setGenerating } = useImageStore((state) => ({
    generating: state.generating,
    setGenerating: state.setGenerating,
  }));
  const { activeLayer, addLayer, setActiveLayer } = useLayerStore((state) => ({
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    setActiveLayer: state.setActiveLayer,
  }));

  const [prompt, setPrompt] = useState("");

  const handleReplace = async () => {
    setGenerating(true);
    const res = await bgReplace({
      activeImage: activeLayer.url!,
      prompt: prompt,
      activeImageName: activeLayer.name!,
    });

    if (res?.data?.success) {
      const newLayerId = crypto.randomUUID();
      addLayer({
        id: newLayerId,
        url: res.data.success.secure_url,
        format: activeLayer.format,
        height: activeLayer.height,
        width: activeLayer.width,
        name: "bgreplaced-" + activeLayer.name,
        publicId: res.data.success.public_id,
        resourceType: "image",
      });
      setActiveLayer(newLayerId);
      toast.success("Background replace successfully");
    }
    if (res?.serverError) {
      toast.error("Background replace failed");
      console.error("Error in Background Removal process:", res.serverError);
    }
    setGenerating(false);
  };

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            BG Replace <ImageOff size={20} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-6" side="right" sideOffset={16}>
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
            <div className="flex flex-col justify-center gap-3">
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                className="col-span-2 h-8"
                value={prompt}
                name="prompt"
                placeholder="Describe the new background"
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full mt-4 flex items-center justify-center gap-2"
          disabled={!activeLayer?.url || generating}
          onClick={handleReplace}
        >
          {generating ? "Generating..." : "Replace Background"}
          <Sparkles size={16} />
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default BgReplace;
