import Image from "next/image";
import { Layer } from "@/lib/layer-store";
import { cn } from "@/lib/utils";

interface LayerImageProps {
  layer: Layer;
  className?: string;
}

function LayerImage({ layer, className }: LayerImageProps) {
  if (layer.url)
    return (
      <div
        className={cn(
          "flex items-center justify-center relative shrink-0",
          className
        )}
      >
        <Image
          className="w-full object-contain h-full rounded-sm z-10"
          alt={"layer"}
          src={layer.format === "mp4" ? layer.poster || layer.url : layer.url}
          fill
        />
        <Image
          className="w-full object-cover h-full rounded-sm opacity-60"
          alt={"layer"}
          src="/images/layer-placeholder.jpg"
          fill
        />
      </div>
    );
}

export default LayerImage;
