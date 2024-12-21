"use client";

import { User as UserData } from "@prisma/client";
import { ChevronRight, Scissors, Sparkles, WandSparkles } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";

import decreaseCredits from "../../../server/decrease-credits";
import { extractPart } from "../../../server/extract-part";
import { uploadImageToDB } from "../../../server/upload-image";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

function ExtractPart({ user, userData }: { user: User; userData: UserData }) {
  const { generating, setGenerating } = useImageStore((state) => ({
    generating: state.generating,
    setGenerating: state.setGenerating,
  }));
  const { activeLayer, addLayer, setActiveLayer } = useLayerStore((state) => ({
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    setActiveLayer: state.setActiveLayer,
  }));

  const [prompts, setPrompts] = useState([""]);
  const [multiple, setMultiple] = useState(false);
  const [mode, setMode] = useState("default");
  const [invert, setInvert] = useState(false);

  const addPrompt = () => {
    setPrompts([...prompts, ""]);
  };

  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const handleExtract = async () => {
    setGenerating(true);

    try {
      await decreaseCredits(5, user.email!);

      const res = await extractPart({
        prompts: prompts.filter((p) => p.trim() !== ""),
        activeImage: activeLayer.url!,
        format: activeLayer.format!,
        multiple,
        mode: mode as "default" | "mask",
        invert,
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
          name: "extracted-" + activeLayer.name,
          format: "png",
          height: activeLayer.height,
          width: activeLayer.width,
          url: newData.secure_url,
          publicId: newData.public_id,
          resourceType: "image",
        });
        setActiveLayer(newLayerId);
        setActiveLayer(newLayerId);
        toast.success("Object extracted successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Object extraction failed, ${error.message}`);
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
                <Scissors size={18} />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            AI Extract
          </TooltipContent>
          <PopoverContent className="w-full p-6" side="right" sideOffset={16}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">AI Extract</h4>
                <p className="text-sm text-muted-foreground">
                  Extract specific areas or objects from your image using AI.
                </p>
              </div>
              <div className="grid gap-2">
                {prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center-center gap-4"
                  >
                    <Label htmlFor={`prompt-${index}`}>
                      Prompt {index + 1} :
                    </Label>
                    <Input
                      id={`prompt-${index}`}
                      value={prompt}
                      onChange={(e) => updatePrompt(index, e.target.value)}
                      placeholder="Describe what to extract"
                      className="col-span-2 h-8"
                    />
                  </div>
                ))}
                <Button
                  onClick={addPrompt}
                  size="sm"
                  className="flex justify-center items-center gap-2 my-2 sm:my-0"
                >
                  Add Prompt
                  <ChevronRight size={16} />
                </Button>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiple"
                    checked={multiple}
                    onCheckedChange={(checked) =>
                      setMultiple(checked as boolean)
                    }
                  />
                  <Label htmlFor="multiple">Extract multiple objects</Label>
                </div>

                <RadioGroup value={mode} onValueChange={setMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="mode-default" />
                    <Label htmlFor="mode-default">
                      Default (transparent background)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mask" id="mode-mask" />
                    <Label htmlFor="mode-mask">Mask</Label>
                  </div>
                </RadioGroup>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="invert"
                    checked={invert}
                    onCheckedChange={(checked) => setInvert(checked as boolean)}
                  />
                  <Label htmlFor="invert">Invert (keep background)</Label>
                </div>
              </div>
              <p className="text-xs flex  items-center gap-1">
                Costs: 5 Credits <Sparkles size={14} />
              </p>
            </div>
            {userData?.credits < 5 ? (
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
                    You need at least 5 credits to extract the object.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                disabled={
                  userData?.credits < 5 ||
                  !activeLayer?.url ||
                  generating ||
                  prompts.every((p) => p.trim() === "")
                }
                className="w-full mt-2 flex items-center justify-center gap-2"
                onClick={handleExtract}
              >
                {generating ? "Extracting..." : "Extract Object"}
                <WandSparkles size={16} />
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ExtractPart;
