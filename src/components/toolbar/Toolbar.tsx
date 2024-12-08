import { useLayerStore } from "@/lib/layer-store";
import ImageTools from "./ImageTools";
import VideoTools from "./VideoTools";
import UserActions from "./UserActions";
import { cn } from "@/lib/utils";

function Toolbar() {
  const activeLayer = useLayerStore((state) => state.activeLayer);

  return (
    <div className="p-4 flex flex-col gap-2">
      <UserActions />
      <div
        className={cn(
          "flex flex-col gap-2 bg-background items-center rounded-2xl p-2 w-fit",
          {
            hidden:
              activeLayer.resourceType !== "image" &&
              activeLayer.resourceType !== "video",
          }
        )}
      >
        {activeLayer.resourceType === "image" ? <ImageTools /> : null}
        {activeLayer.resourceType === "video" ? <VideoTools /> : null}
      </div>
    </div>
  );
}

export default Toolbar;
