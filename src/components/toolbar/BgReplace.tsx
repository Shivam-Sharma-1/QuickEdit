"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ImageOff, Sparkles, WandSparkles } from "lucide-react";
import { bgReplace } from "../../../server/bg-replace";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import decreaseCredits from "../../../server/decrease-credits";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { uploadImageToDB } from "../../../server/upload-image";
import { User as UserData } from "@prisma/client";
import { User } from "next-auth";

function BgReplace({ user, userData }: { user: User; userData: UserData }) {
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

    try {
      await decreaseCredits(5, user.email!);

      const res = await bgReplace({
        activeImage: activeLayer.url!,
        prompt: prompt,
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
          url: newData.secure_url,
          format: activeLayer.format,
          height: activeLayer.height,
          width: activeLayer.width,
          name: "bgreplaced-" + activeLayer.name,
          publicId: newData.public_id,
          resourceType: "image",
        });
        setActiveLayer(newLayerId);
        toast.success("Background replace successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Background replace failed, ${error.message}`);
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
                <ImageOff size={20} />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Background Replace
          </TooltipContent>
          <PopoverContent className="w-full p-6" side="right" sideOffset={16}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-relaxed">
                  Generative Background Replace
                </h4>
                <p className="text-sm text-muted-foreground">
                  Replace the background of your image with AI-generated
                  content.
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
              <p className="text-xs flex  items-center gap-1">
                Costs: 5 Credits <Sparkles size={14} />
              </p>
            </div>

            <Button
              className="w-full mt-2 flex items-center justify-center gap-2"
              disabled={
                userData?.credits < 5 || !activeLayer?.url || generating
              }
              onClick={handleReplace}
            >
              {generating ? "Generating..." : "Replace Background"}
              <WandSparkles size={16} />
            </Button>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
}

export default BgReplace;
