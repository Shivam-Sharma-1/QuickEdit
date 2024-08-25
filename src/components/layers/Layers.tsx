import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Layers2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import LayerImage from "./LayerImage";

export default function Layers() {
  const layers = useLayerStore((state) => state.layers);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const generating = useImageStore((state) => state.generating);

  return (
    <Card className="basis-[320px] shrink-0  scrollbar-thin scrollbar-track-secondary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl">
      <CardHeader className="sticky top-0 z-50 px-4 py-6  min-h-28 bg-card shadow-sm">
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
        {layers.map((layer, index) => (
          <div
            className={cn(
              "cursor-pointer ease-in-out hover:bg-secondary border border-transparent",
              { "animate-pulse": generating }
            )}
            key={layer.id}
          >
            <div>
              <div>
                {!layer.url ? (
                  <p className="text-xs font-medium justofy-self-end">
                    {" "}
                    New Layer
                  </p>
                ) : null}
                <LayerImage layer={layer} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardContent className="sticky bottom-0 bg-card flex gap-2 shrink-0">
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
      </CardContent>
    </Card>
  );
}
