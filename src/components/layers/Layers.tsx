"use client";

import {
  ArrowRight,
  Frown,
  Images,
  Layers2,
  PanelRightClose,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { useResponsive } from "@/lib/hooks/useResponsive";
import { useImageStore } from "@/lib/image-store";
import { Layer, useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";

import LayerImage from "./LayerImage";
import LayerInfo from "./LayerInfo";
import getLayers from "../../../server/get-layers";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function Layers() {
  const isMobile = useResponsive(1024);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(isMobile ? false : true);
  }, [isMobile]);

  useEffect(() => {
    const fetchLayers = async () => {
      const { layers } = await getLayers();
      setLayers(layers as Layer[]);
      // setActiveLayer(layers && layers[0] ? layers[0].id : "");
    };
    fetchLayers();
  }, []);

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
    setLayers,
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
    setLayers: state.setLayers,
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

  const layersEle =
    visibleLayers.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full">
        <Frown />
        <p className="text-sm text-secondary-foreground mt-2 text-center">
          No layers to show
          <br />
          Add a new layer to get started
        </p>
      </div>
    ) : (
      visibleLayers.map((layer, index) => (
        <div
          className={cn(
            "cursor-pointer ease-in-out hover:bg-secondary border border-transparent w-full p-1 rounded-sm",
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
            <LayerImage layer={layer} className="w-14 h-14" />
            {layer.url && (
              <div className="flex-1 flex flex-col gap-1 w-min overflow-x-hidden">
                <p className="text-xs overflow-hidden text-wrap">{`${layer.name}.${layer.format}`}</p>
                <p className="text-[0.7rem] overflow-hidden text-wrap text-[#94a3b8]">
                  {layer.width} X {layer.height}
                </p>
              </div>
            )}
            <LayerInfo layer={layer} layerIndex={index} />
          </div>
        </div>
      ))
    );

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-6 top-9 z-50 lg:hidden bg-background active:bg-background focus:bg-background"
      >
        <PanelRightClose
          className={cn("h-4 w-4 transition-transform", {
            "rotate-180": !isOpen,
          })}
        />
      </Button>

      <Card
        className={cn(
          "fixed lg:relative right-0 top-0 h-[calc(100svh-2rem)] lg:h-auto basis-[360px] my-4 mr-4 shrink-0 overflow-y-auto overflow-x-hidden flex flex-col shadow-2xl rounded-2xl transition-transform duration-300 ease-in-out z-40",
          {
            "translate-x-0": isOpen,
            "translate-x-[calc(100%+20px)]": !isOpen,
          }
        )}
      >
        <CardHeader className="sticky top-0 z-20 p-6 pb-1 flex flex-col gap-4 bg-card shadow-sm">
          <div className="flex flex-col gap-1 ">
            <CardTitle className="text-xl">
              {activeLayer.name || "Select a Layer"}
            </CardTitle>
            {activeLayer.width && activeLayer.height ? (
              <CardDescription className="text-xs">
                {activeLayer.width} X {activeLayer.height}
              </CardDescription>
            ) : null}
            <h4 className="mt-1 font-medium">Layers</h4>
          </div>
          {layerComparisonMode && (
            <div className="flex flex-col gap-1 ">
              <CardTitle className="text-sm pb-2">Comparing...</CardTitle>
              <CardDescription className="flex gap-2 items-center mb-2">
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
          {layersEle}
        </CardContent>

        <CardContent className="sticky bottom-0 bg-card flex gap-2 shrink-0 p-4 z-20">
          {layers.length >= 10 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="outline"
                      className="w-full flex gap-2"
                      disabled
                    >
                      <span className="text-xs">Create Layer</span>
                      <Layers2
                        className="text-secondary-foreground"
                        size={18}
                      />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  <p>Upgrade to Premium to add more layers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={handleAddLayer}
              variant="outline"
              className="w-full flex gap-2"
            >
              <span className="text-xs">Create Layer</span>
              <Layers2 className="text-secondary-foreground" size={18} />
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full flex gap-2 text-xs"
            disabled={!activeLayer.url || activeLayer.resourceType === "video"}
            onClick={() => {
              if (layerComparisonMode)
                setLayerComparisonMode(!layerComparisonMode);
              else setComparedLayers([activeLayer.id]);
            }}
          >
            <span className="text-xs">
              {layerComparisonMode ? "Stop comparing" : "Compare Layers"}
            </span>
            {!layerComparisonMode && (
              <Images className="text-secondary-foreground" size={18} />
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
