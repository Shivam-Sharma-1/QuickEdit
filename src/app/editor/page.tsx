"use client";

import Editor from "@/components/Editor";
import { ImageStore } from "@/lib/image-store";
import { LayerStore } from "@/lib/layer-store";

function page() {
  return (
    <LayerStore.Provider
      initialValue={{
        layerComparisonMode: false,
        layers: [
          {
            id: crypto.randomUUID(),
            url: "",
            height: 0,
            width: 0,
            publicId: "",
          },
        ],
      }}
    >
      <ImageStore.Provider
        initialValue={{
          activeTag: "all",
          generating: false,
          activeColor: "green",
        }}
      >
        <Editor />
      </ImageStore.Provider>
    </LayerStore.Provider>
  );
}

export default page;
