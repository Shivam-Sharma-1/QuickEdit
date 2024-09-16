import React, { useState } from "react";
import UploadImage from "./UploadImage";
import { useLayerStore } from "@/lib/layer-store";

function UploadForm() {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const [selectedType, setSelectedType] = useState("image");

  if (!activeLayer.url) {
    return (
      <div className="w-full p-24 flex flex-col  justify-center  h-full">
        {selectedType === "image" ? <UploadImage /> : null}
      </div>
    );
  }
}

export default UploadForm;
