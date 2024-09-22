"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import React, { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Crop, Sparkles } from "lucide-react";
import { Label } from "../ui/label";
import { genFill } from "../../../server/gen-fill";
import { Slider } from "../ui/slider";
import { toast } from "sonner";

const PREVIEW_SIZE = 250;
const EXPANSION_THRESHOLD = 250;

function GenFill() {
  const generating = useImageStore((state) => state.generating);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const previewStyle = useMemo(() => {
    if (!activeLayer.width || !activeLayer.height) return {};

    const newWidth = activeLayer.width + width;
    const newHeight = activeLayer.height + height;

    const scale = Math.min(PREVIEW_SIZE / newWidth, PREVIEW_SIZE / newHeight);

    return {
      width: `${newWidth * scale}px`,
      height: `${newHeight * scale}px`,
      backgroundImage: `url(${activeLayer.url})`,
      backgroundSize: `${activeLayer.width * scale}px ${
        activeLayer.height * scale
      }px`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      position: "relative" as const,
    };
  }, [activeLayer, width, height]);

  const previewOverlayStyle = useMemo(() => {
    if (!activeLayer.width || !activeLayer.height) return {};

    const scale = Math.min(
      PREVIEW_SIZE / (activeLayer.width + width),
      PREVIEW_SIZE / (activeLayer.height + height)
    );

    const leftWidth = width > 0 ? `${(width / 2) * scale}px` : "0";
    const rightWidth = width > 0 ? `${(width / 2) * scale}px` : "0";
    const topHeight = height > 0 ? `${(height / 2) * scale}px` : "0";
    const bottomHeight = height > 0 ? `${(height / 2) * scale}px` : "0";

    return {
      position: "absolute" as const,
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      boxShadow: `inset ${leftWidth} ${topHeight} 0 #24a0ed, 
                  inset -${rightWidth} ${topHeight} 0 #24a0ed, 
                  inset ${leftWidth} -${bottomHeight} 0 #24a0ed, 
                  inset -${rightWidth} -${bottomHeight} 0 #24a0ed`,
    };
  }, [activeLayer, width, height]);

  const handleGenFill = async () => {
    setGenerating(true);
    const res = await genFill({
      width: (width + activeLayer.width!).toString(),
      height: (height + activeLayer.height!).toString(),
      aspect: "1:1",
      activeImage: activeLayer.url!,
      activeImageName: activeLayer.name!,
    });

    if (res?.data?.success) {
      setGenerating(false);
      const newLayerId = crypto.randomUUID();
      addLayer({
        id: newLayerId,
        name: "genfill-" + activeLayer.name,
        format: activeLayer.format,
        height: res.data.success.height,
        width: res.data.success.width,
        url: res.data.success.secure_url,
        publicId: res.data.success.public_id,
        resourceType: "image",
      });
      setActiveLayer(newLayerId);
      toast.success("Generative filled successfully");
    }

    if (res?.serverError) {
      setGenerating(false);
      toast.error("Generative filled failed");
      console.error("Error in Generative fill process:", res.serverError);
    }
  };

  const ExpansionIndicator = ({
    value,
    axis,
  }: {
    value: number;
    axis: "x" | "y";
  }) => {
    const isVisible = Math.abs(value) >= EXPANSION_THRESHOLD;
    const position =
      axis === "x"
        ? {
            top: "50%",
            [value > 0 ? "right" : "left"]: 0,
            transform: "translateY(-50%)",
          }
        : {
            left: "50%",
            [value > 0 ? "bottom" : "top"]: 0,
            transform: "translateX(-50%)",
          };

    return (
      <div>
        {isVisible && (
          <div
            className="absolute bg-primary dark:text-blue-950 text-white px-2 py-1 rounded-md text-xs font-bold"
            style={position}
          >
            {Math.abs(value)}px
          </div>
        )}
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            Generative Fill
            <Crop size={18} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-6" side="right" sideOffset={16}>
        <div className="flex flex-col h-full">
          <div className="space-y-2">
            <div className="text-center">
              <h4 className="font-medium text-center py-2 leading-none">
                Generative Fill
              </h4>
              <p className="text-sm text-muted-foreground">
                Generatively fill and resize the image with AI.
              </p>
            </div>
            {activeLayer.width && activeLayer.height ? (
              <div className="flex gap-24 justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-xs">Current Size:</span>
                  <p className="text-sm text-primary font-bold">
                    {activeLayer.width} X {activeLayer.height}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs">New Size:</span>
                  <p className="text-sm text-primary font-bold">
                    {activeLayer.width + width} X {activeLayer.height + height}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex gap-4 items-center justify-center">
            <div className="text-center">
              <Label htmlFor="width">Modify Width</Label>
              <Slider
                name="width"
                min={-activeLayer.width! + 100}
                max={activeLayer.width! + 200}
                defaultValue={[width]}
                value={[width]}
                onValueChange={(value: number[]) => setWidth(value[0])}
                className="h-8 w-[160px]"
              />
            </div>
            <div className="text-center">
              <Label htmlFor="height">Modify Height</Label>
              <Slider
                name="height"
                min={-activeLayer.height! + 100}
                max={activeLayer.height! + 200}
                defaultValue={[height]}
                value={[height]}
                onValueChange={(value: number[]) => setHeight(value[0])}
                className="h-8 w-[160px]"
              />
            </div>
          </div>

          <div
            className="preview-container flex justify-center items-center overflow-hidden m-auto flex-grow"
            style={{
              width: `${PREVIEW_SIZE}px`,
              height: `${PREVIEW_SIZE}px`,
            }}
          >
            <div style={previewStyle}>
              <div className="animate-pulse" style={previewOverlayStyle}></div>
              <ExpansionIndicator value={width} axis="x" />
              <ExpansionIndicator value={height} axis="y" />
            </div>
          </div>
          <Button
            className="w-full mt-4 flex items-center justify-center gap-2"
            disabled={!activeLayer.url || (!width && !height) || generating}
            onClick={handleGenFill}
          >
            {generating ? "Generating ..." : "Generative Fill"}
            <Sparkles size={16} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default GenFill;
