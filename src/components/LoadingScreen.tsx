import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import * as loadingAnimation from "../../public/animations/loading.json";
import dynamic from "next/dynamic";

function LoadingScreen() {
  const generating = useImageStore((state) => state.generating);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);

  return (
    <Dialog open={generating} onOpenChange={setGenerating}>
      <DialogContent
        className="sm:max-w-[425px] flex flex-col items-center"
        setGenerating={setGenerating}
      >
        <DialogHeader>
          <DialogTitle className="leading-8">
            Uploading/Editing {activeLayer.name}
          </DialogTitle>
          <DialogDescription>
            Please note that this operation might take up to a couple of
            seconds.
          </DialogDescription>
        </DialogHeader>
        <Lottie className="w-36" animationData={loadingAnimation} />
      </DialogContent>
    </Dialog>
  );
}

export default LoadingScreen;
