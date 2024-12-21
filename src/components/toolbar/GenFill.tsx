"use client";

import { User as UserData } from "@prisma/client";
import { Crop, Sparkles, WandSparkles } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
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
import { genFill } from "../../../server/gen-fill";
import { uploadImageToDB } from "../../../server/upload-image";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Slider } from "../ui/slider";

const PREVIEW_SIZE = 250;
const EXPANSION_THRESHOLD = 250;

function GenFill({ user, userData }: { user: User; userData: UserData }) {
  const { generating, setGenerating } = useImageStore((state) => ({
    generating: state.generating,
    setGenerating: state.setGenerating,
  }));
  const { activeLayer, addLayer, setActiveLayer } = useLayerStore((state) => ({
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    setActiveLayer: state.setActiveLayer,
  }));

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

    try {
      await decreaseCredits(5, user.email!);

      const res = await genFill({
        width: (width + activeLayer.width!).toString(),
        height: (height + activeLayer.height!).toString(),
        aspect: "1:1",
        activeImage: activeLayer.url!,
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
          name: "genfill-" + activeLayer.name,
          format: activeLayer.format,
          height: newData.height,
          width: newData.width,
          url: newData.secure_url,
          publicId: newData.public_id,
          resourceType: "image",
        });
        setActiveLayer(newLayerId);
        toast.success("Generative filled successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Generative filled failed, ${error.message}`);
        console.error("Error in Generative fill process:", error.message);
      }
    } finally {
      setGenerating(false);
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
            Generative Fill
          </TooltipContent>
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
                        {activeLayer.width + width} X{" "}
                        {activeLayer.height + height}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col sm:flex-row mt-2 sm:mt-0 gap-4 items-center justify-center">
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
                  <div
                    className="animate-pulse"
                    style={previewOverlayStyle}
                  ></div>
                  <ExpansionIndicator value={width} axis="x" />
                  <ExpansionIndicator value={height} axis="y" />
                </div>
              </div>
              <p className="text-xs flex  items-center gap-1 mt-3">
                Costs: 5 Credits <Sparkles size={14} />
              </p>
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
                      You need at least 5 credits to generative fill the image.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  className="w-full mt-2 flex items-center justify-center gap-2"
                  disabled={
                    userData?.credits < 5 ||
                    !activeLayer.url ||
                    (!width && !height) ||
                    generating
                  }
                  onClick={handleGenFill}
                >
                  {generating ? "Generating ..." : "Generative Fill"}
                  <WandSparkles size={16} />
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
}

export default GenFill;
