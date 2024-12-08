"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronRight, Scissors, Sparkles } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { extractPart } from "../../../server/extract-part";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import decreaseCredits from "../../../server/decrease-credits";

function ExtractPart() {
  const { generating, setGenerating } = useImageStore((state) => ({
    generating: state.generating,
    setGenerating: state.setGenerating,
  }));
  const { activeLayer, addLayer, setActiveLayer } = useLayerStore((state) => ({
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    setActiveLayer: state.setActiveLayer,
  }));
  const { data: session } = useSession();

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
      await decreaseCredits(5, session?.user?.email!);

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
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            AI Extract
            <Scissors size={18} />
          </span>
        </Button>
      </PopoverTrigger>
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
                <Label htmlFor={`prompt-${index}`}>Prompt {index + 1} :</Label>
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
              className="flex justify-center items-center gap-2"
            >
              Add Prompt
              <ChevronRight size={16} />
            </Button>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiple"
                checked={multiple}
                onCheckedChange={(checked) => setMultiple(checked as boolean)}
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
        </div>
        <Button
          disabled={
            !activeLayer?.url ||
            generating ||
            prompts.every((p) => p.trim() === "")
          }
          className="w-full mt-4 flex items-center justify-center gap-2"
          onClick={handleExtract}
        >
          {generating ? "Extracting..." : "Extract Object"}
          <Sparkles size={16} />
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default ExtractPart;
