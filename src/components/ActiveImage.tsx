import { useImageStore } from "@/lib/image-store";
import { Layer, useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ImageComparison from "./layers/ImageComparison";

export default function ActiveImage() {
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const layers = useLayerStore((state) => state.layers);
  const layerComparisonMode = useLayerStore(
    (state) => state.layerComparisonMode
  );
  const comparedLayers = useLayerStore((state) => state.comparedLayers);

  if (!activeLayer.url && comparedLayers.length === 0) return null;

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

  if (layerComparisonMode && comparedLayers.length > 0) {
    const comparisonLayers = comparedLayers
      .map((id) => layers.find((l) => l.id === id))
      .filter(Boolean) as Layer[];

    return (
      <div className="flex-1 relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
        <ImageComparison layers={comparisonLayers} />
      </div>
    );
  }

  return (
    <div className="flex-1 relative h-svh p-10 pl-0 lg:p-24 bg-secondary flex flex-col items-center justify-center">
      {renderLayer(activeLayer)}
    </div>
  );
}
