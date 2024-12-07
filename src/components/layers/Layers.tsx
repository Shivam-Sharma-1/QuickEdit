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
  const {
    layers,
    activeLayer,
    setActiveLayer,
    addLayer,
    layerComparisonMode,
    setLayerComparisonMode,
    comparedLayers,
    toggleComparedLayer,
    setComparedLayers,
  } = useLayerStore((state) => ({
    layers: state.layers,
    activeLayer: state.activeLayer,
    setActiveLayer: state.setActiveLayer,
    addLayer: state.addLayer,
    layerComparisonMode: state.layerComparisonMode,
    setLayerComparisonMode: state.setLayerComparisonMode,
    comparedLayers: state.comparedLayers,
    toggleComparedLayer: state.toggleComparedLayer,
    setComparedLayers: state.setComparedLayers,
  }));
  const { generating } = useImageStore((state) => ({
    generating: state.generating,
  }));

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

  const handleAddLayer = () => {
    const newLayerId = crypto.randomUUID();
    addLayer({
      id: newLayerId,
      url: "",
      height: 0,
      width: 0,
      publicId: "",
      name: "",
      format: "",
    });
    setActiveLayer(newLayerId);
  };

  return (
    <Card className="basis-[360px] shrink-0 scrollbar-thin scrollbar-track-secondary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl ">
      <CardHeader className="sticky top-0 z-50 p-6 flex flex-col gap-4 bg-card shadow-sm">
        <div className="flex flex-col gap-1 ">
          <CardTitle className="text-md">
            {activeLayer.name || "Layers"}
          </CardTitle>
          {activeLayer.width && activeLayer.height ? (
            <CardDescription className="text-xs">
              {activeLayer.width} X {activeLayer.height}
            </CardDescription>
          ) : null}
        </div>
        {layerComparisonMode && (
          <div className="flex flex-col gap-1 ">
            <CardTitle className="text-sm pb-2">Comparing...</CardTitle>
            <CardDescription className="flex gap-2 items-center">
              <Image
                src={getLayerName(comparedLayers[0]) as string}
                width={60}
                height={60}
                alt="Layer 1"
              />
              {comparedLayers.length > 0 && <ArrowRight />}
              {comparedLayers.length > 1 ? (
                <Image
                  src={getLayerName(comparedLayers[1]) as string}
                  width={60}
                  height={60}
                  alt="Layer 2"
                />
              ) : (
                "Nothing here"
              )}
            </CardDescription>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-2 w-full">
        {visibleLayers.map((layer, index) => (
          <div
            className={cn(
              "cursor-pointer ease-in-out hover:bg-secondary border border-transparent w-full p-1",
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
            <div className="flex w-full gap-4 items-center justify-between">
              {!layer.url ? (
                <p className="text-xs font-medium justify-self-end pl-2">
                  New Layer
                </p>
              ) : null}
              <LayerImage layer={layer} />
              {layer.url && (
                <p className="text-xs text-center w-[170px] overflow-hidden text-wrap">{`${layer.name}.${layer.format}`}</p>
              )}
              <LayerInfo layer={layer} layerIndex={index} />
            </div>
          </div>
        ))}
      </CardContent>

      <CardContent className="sticky bottom-0 bg-card flex gap-2 shrink-0 p-4">
        <Button
          onClick={handleAddLayer}
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
