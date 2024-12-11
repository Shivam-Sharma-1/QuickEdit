"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Ellipsis, Trash } from "lucide-react";
import { Layer, useLayerStore } from "@/lib/layer-store";
import {
  deleteResource,
  deleteResourceFromDB,
} from "../../../server/delete-resource";
import { toast } from "sonner";
import { useImageStore } from "@/lib/image-store";

export default function LayerInfo({
  layer,
  layerIndex,
}: {
  layer: Layer;
  layerIndex: number;
}) {
  const { layers, setActiveLayer, removeLayer } = useLayerStore((state) => ({
    layers: state.layers,
    setActiveLayer: state.setActiveLayer,
    removeLayer: state.removeLayer,
  }));
  const setGenerating = useImageStore((state) => state.setGenerating);

  const handleDeleteLayer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setGenerating(true);
    e.stopPropagation();

    try {
      await deleteResource({
        publicId: layer.publicId!,
        resourceType: layer.resourceType as "image" | "video",
      });
      await deleteResourceFromDB({
        publicId: layer.publicId!,
        resourceType: layer.resourceType as "image" | "video",
      });
      setActiveLayer(layers[0].id);
      removeLayer(layer.id);
      toast.success("Layer deleted successfully");
    } catch (error) {
      toast.error("Layer deletion failed");
      console.error("Error in Layer Deletion process:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-0">
          <Ellipsis size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6 justify-center leading-8">
        <h3 className="text-[1.2rem] font-medium mt-2 w-full text-wrap overflow-hidden">
          Layer: {layer.name}
        </h3>
        <div className="flex flex-col gap-3 text-wrap w-full">
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
          onClick={handleDeleteLayer}
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
