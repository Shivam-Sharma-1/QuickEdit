"use client";

import { ImageStore } from "@/lib/image-store";
import { LayerStore } from "@/lib/layer-store";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {children}
      </ImageStore.Provider>
    </LayerStore.Provider>
  );
}
