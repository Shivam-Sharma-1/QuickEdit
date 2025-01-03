import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

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
            Uploading/Editing {activeLayer?.name ? activeLayer.name : "Asset"}
          </DialogTitle>
          <DialogDescription>
            Please note that this operation might take up to a couple of
            seconds.
          </DialogDescription>
        </DialogHeader>
        <DotLottieReact
          src="https://lottie.host/0a047b9a-7710-4f20-a0ca-eee4f042e55c/zZS4zvJxH9.lottie"
          loop
          autoplay
          style={{ width: 300, height: 300, objectFit: "contain", zIndex: 10 }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default LoadingScreen;
