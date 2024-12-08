import Image from "next/image";
import { Layer } from "@/lib/layer-store";

function LayerImage({ layer }: { layer: Layer }) {
  if (layer.url)
    return (
      <div className="w-16 h-16 flex items-center justify-center relative shrink-0">
        <Image
          className="w-full object-contain h-full rounded-sm z-10"
          alt={"layer"}
          src={layer.format === "mp4" ? layer.poster || layer.url : layer.url}
          fill
        />
        <Image
          className="w-full object-cover h-full rounded-sm opacity-60"
          alt={"layer"}
          src="/layer-placeholder.jpg"
          fill
        />
      </div>
    );
}

export default LayerImage;
