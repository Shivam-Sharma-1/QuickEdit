import { useImageStore } from "@/lib/image-store";
import { Layer, useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ActiveImage() {
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);

  const layers = useLayerStore((state) => state.layers);

  const renderLayer = (layer: Layer) => (
    <div className="relative w-full h-full flex items-center justify-center">
      {layer.resourceType === "image" && (
        <Image
          alt={layer.name || "Image"}
          src={layer.url || ""}
          fill={true}
          className={cn(
            "rounded-lg object-contain",
            generating ? "animate-pulse" : ""
          )}
        />
      )}
      {layer.resourceType === "video" && (
        <video
          width={layer.width}
          height={layer.height}
          controls
          className="rounded-lg object-contain max-w-full max-h-full"
          src={layer.transcriptionURL || layer.url}
        />
      )}
    </div>
  );

  return (
    <div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
      {renderLayer(activeLayer)}
    </div>
  );
}
