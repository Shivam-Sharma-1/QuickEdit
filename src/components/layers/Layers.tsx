import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowRight, Images, Layers2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import LayerImage from "./LayerImage";
import LayerInfo from "./LayerInfo";
import { useMemo } from "react";
import Image from "next/image";

export default function Layers() {
  const layers = useLayerStore((state) => state.layers);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const generating = useImageStore((state) => state.generating);
  const layerComparisonMode = useLayerStore(
    (state) => state.layerComparisonMode
  );
  const setLayerComparisonMode = useLayerStore(
    (state) => state.setLayerComparisonMode
  );
  const comparedLayers = useLayerStore((state) => state.comparedLayers);
  const toggleComparedLayer = useLayerStore(
    (state) => state.toggleComparedLayer
  );
  const setComparedLayers = useLayerStore((state) => state.setComparedLayers);

  const getLayerName = useMemo(
    () => (id: string) => {
      const layer = layers.find((layer) => layer.id === id);
      return layer ? layer.url : "Nothing here";
    },
    [layers]
  );

  const visibleLayers = useMemo(
    () =>
      layerComparisonMode
        ? layers.filter((layer) => layer.url && layer.resourceType === "image")
        : layers,
    [layerComparisonMode, layers]
  );

  return (
    <Card className="basis-[360px] shrink-0  scrollbar-thin scrollbar-track-secondary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl">
      <CardHeader className="sticky top-0 z-50 px-4 py-6  min-h-28 bg-card shadow-sm">
        {layerComparisonMode && (
          <div className="flex flex-col gap-1 ">
            <CardTitle className="text-sm pb-2">Comparing...</CardTitle>
            <CardDescription className="flex gap-2 items-center">
              <Image
                src={getLayerName(comparedLayers[0]) as string}
                width={32}
                height={32}
                alt="Layer 1"
              />
              {comparedLayers.length > 0 && <ArrowRight />}
              {comparedLayers.length > 1 ? (
                <Image
                  src={getLayerName(comparedLayers[1]) as string}
                  width={32}
                  height={32}
                  alt="Layer 2"
                />
              ) : (
                "Nothing here"
              )}
            </CardDescription>
          </div>
        )}
        <div className="flex flex-col gap-1 ">
          <CardTitle className="text-sm ">
            {activeLayer.name || "Layers"}
          </CardTitle>
          {activeLayer.width && activeLayer.height ? (
            <CardDescription className="text-xs">
              {activeLayer.width}X{activeLayer.height}
            </CardDescription>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {visibleLayers.map((layer, index) => (
          <div
            className={cn(
              "cursor-pointer ease-in-out hover:bg-secondary border border-transparent",
              {
                "animate-pulse": generating,
                "border-primary": layerComparisonMode
                  ? comparedLayers.includes(layer.id)
                  : activeLayer.id === layer.id,
              }
            )}
            key={layer.id}
            onClick={() => {
              if (generating) return;
              if (layerComparisonMode) toggleComparedLayer(layer.id);
              else setActiveLayer(layer.id);
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                {!layer.url ? (
                  <p className="text-xs font-medium justofy-self-end">
                    {" "}
                    New Layer
                  </p>
                ) : null}
                <LayerImage layer={layer} />
                <LayerInfo layer={layer} layerIndex={index} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardContent className="sticky bottom-0 bg-card flex gap-2 shrink-0 p-4">
        <Button
          onClick={() => {
            addLayer({
              id: crypto.randomUUID(),
              url: "",
              height: 0,
              width: 0,
              publicId: "",
              name: "",
              format: "",
            });
          }}
          variant="outline"
          className="w-full flex gap-2"
        >
          <span className="text-xs">Create Layer</span>
          <Layers2 className="text-secondary-foreground" size={18} />
        </Button>
        <Button
          variant="outline"
          className="w-full flex gap-2"
          disabled={!activeLayer.url || activeLayer.resourceType === "video"}
          onClick={() => {
            if (layerComparisonMode)
              setLayerComparisonMode(!layerComparisonMode);
            else setComparedLayers([activeLayer.id]);
          }}
        >
          <span>
            {layerComparisonMode ? "Stop comparing" : "Compare Layers"}
          </span>
          {!layerComparisonMode && (
            <Images className="text-secondary-foreground" size={18} />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
