"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { Ellipsis, Image, Trash } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useImageStore } from "@/lib/image-store";
import { Layer, useLayerStore } from "@/lib/layer-store";

import LayerImage from "./LayerImage";
import {
  deleteResource,
  deleteResourceFromDB,
} from "../../../server/delete-resource";
import { Button } from "../ui/button";


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
        <Button
          variant="ghost"
          className="p-0 bg-transparent h-fit rounded-full pr-2 hover:bg-transparent"
        >
          <Ellipsis size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6 justify-center leading-8 w-[500px]">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-secondary w-12 h-12 shrink-0 flex justify-center items-center rounded-md">
            <Image className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-medium w-full text-wrap overflow-hidden">
            {layer.name}.{layer.format ? layer.format : "New Layer"}
          </h3>
        </div>
        <div className="flex justify-between gap-3 w-full">
          <div className="flex flex-col gap-1 text-wrap w-full">
            <p className="text-[1rem]">
              <span className="font-semibold">Filename:</span>{" "}
              {layer.name ? layer.name : "New Layer"}
            </p>
            <p className="text-[1rem]">
              <span className="font-semibold">Format:</span>{" "}
              {layer.format ? layer.format : "Nil"}
            </p>
            <p className="text-[1rem]">
              <span className="font-semibold">Dimensions:</span> {layer.width} X{" "}
              {layer.height}
            </p>
          </div>
          <LayerImage layer={layer} className="w-32 h-32" />
        </div>
        <DialogFooter className="flex justify-end items-center gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDeleteLayer} variant={"destructive"}>
            <span> Delete Layer</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
