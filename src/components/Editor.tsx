"use client";

import React from "react";
import Layers from "./layers/Layers";
import { ModeToggle } from "./theme/ModeToggle";
import ActiveImage from "./ActiveImage";
import UploadForm from "./upload/UploadForm";
import { useLayerStore } from "@/lib/layer-store";
import ImageTools from "./toolbar/ImageTools";

function Editor() {
  const activeLayer = useLayerStore((state) => state.activeLayer);

  return (
    <div className="flex h-full">
      <div className="py-6 px-4 min-w-48 ">
        <div className="pb-12 text-center">
          <ModeToggle />
        </div>
        <div className="flex flex-col gap-4 ">
          {activeLayer.resourceType === "image" ? <ImageTools /> : null}
        </div>
      </div>
      <UploadForm />
      <ActiveImage />
      <Layers />
    </div>
  );
}

export default Editor;
