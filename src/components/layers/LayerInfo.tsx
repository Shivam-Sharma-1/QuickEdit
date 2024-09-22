"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Ellipsis, Trash } from "lucide-react";
import { Layer, useLayerStore } from "@/lib/layer-store";

export default function LayerInfo({
  layer,
  layerIndex,
}: {
  layer: Layer;
  layerIndex: number;
}) {
  const layers = useLayerStore((state) => state.layers);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const removeLayer = useLayerStore((state) => state.removeLayer);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-0">
          <Ellipsis size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6 justify-center leading-8">
        <h3 className="text-[1.2rem] font-medium mt-2 w-full">
          Layer: {layer.name}
        </h3>
        <div className="flex flex-col gap-3">
          <p className="text-[1rem]">
            <span className="font-bold">Filename:</span> {layer.name}
          </p>
          <p className="text-[1rem]">
            <span className="font-bold">Format:</span> {layer.format}
          </p>
          <p className="text-[1rem]">
            <span className="font-bold">Size:</span> {layer.width} X{" "}
            {layer.height}
          </p>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setActiveLayer(layerIndex === 0 ? layers[1].id : layers[0].id);
            removeLayer(layer.id);
          }}
          variant={"destructive"}
          className="flex items-center gap-2 w-full"
        >
          <span> Delete Layer</span>
          <Trash size={14} />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
