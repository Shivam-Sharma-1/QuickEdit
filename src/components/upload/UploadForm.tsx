import { ImageIcon, VideoIcon } from "lucide-react";
import React, { useState } from "react";

import { useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";

import UploadImage from "./UploadImage";
import UploadVideo from "./UploadVideo";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

function UploadForm() {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const [selectedType, setSelectedType] = useState("image");
  const layerComparisonMode = useLayerStore(
    (state) => state.layerComparisonMode
  );
  if (!activeLayer.url && !layerComparisonMode)
    return (
      <div className="flex-1 p-10 lg:p-24 flex flex-col  justify-center  h-full">
        {selectedType === "image" ? <UploadImage /> : null}
        {selectedType === "video" ? <UploadVideo /> : null}

        <RadioGroup
          defaultValue="image"
          onValueChange={(e) => {
            setSelectedType(e);
          }}
          className="flex items-center justify-center gap-8 pt-8"
        >
          <Card
            onClick={(e) => setSelectedType("image")}
            className={cn(
              "flex flex-col items-center justify-center py-4 px-6 gap-4 cursor-pointer",
              selectedType === "image" ? "border-primary" : null
            )}
          >
            <CardContent className="flex items-center  space-x-2 p-0">
              <RadioGroupItem value="image" id="image-mode" hidden />
              <Label
                className={`${
                  selectedType === "image" ? "text-primary" : null
                }`}
                htmlFor="image-mode"
              >
                Image Mode
              </Label>
            </CardContent>
            <ImageIcon
              className={`${selectedType === "image" ? "text-primary" : null}`}
              size={36}
            />
          </Card>
          <Card
            onClick={(e) => setSelectedType("video")}
            className={cn(
              "flex flex-col items-center justify-center p-4 gap-4 cursor-pointer",
              selectedType === "video" ? "border-primary" : null
            )}
          >
            <CardContent className="flex items-center  space-x-2 p-0">
              <RadioGroupItem value="video" id="video-mode" hidden />
              <Label
                className={`${
                  selectedType === "video" ? "text-primary" : null
                }`}
                htmlFor="video-mode"
              >
                Video Mode
              </Label>
            </CardContent>
            <VideoIcon
              className={`${selectedType === "video" ? "text-primary" : null}`}
              size={36}
            />
          </Card>
        </RadioGroup>
      </div>
    );
}

export default UploadForm;
