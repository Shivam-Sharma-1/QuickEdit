import { useLayerStore } from "@/lib/layer-store";
import ImageTools from "./ImageTools";
import VideoTools from "./VideoTools";
import UserActions from "./UserActions";

function Toolbar() {
  const activeLayer = useLayerStore((state) => state.activeLayer);

  return (
    <div className="p-4 flex flex-col gap-2">
      <UserActions />
      <div className="flex flex-col gap-2 bg-background items-center rounded-2xl p-2 w-fit">
        {activeLayer.resourceType === "image" ? <ImageTools /> : null}
        {activeLayer.resourceType === "video" ? <VideoTools /> : null}
      </div>
    </div>
  );
}

export default Toolbar;
