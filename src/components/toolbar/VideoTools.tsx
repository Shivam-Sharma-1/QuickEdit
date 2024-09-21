"use client";

import { useLayerStore } from "@/lib/layer-store";
import VideoTranscription from "./VideoTranscription";
import SmartCrop from "./SmartCrop";
import ExportAsset from "./ExportAsset";

export default function VideoTools() {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  if (activeLayer.resourceType === "video")
    return (
      <>
        <VideoTranscription />
        <SmartCrop />
        <ExportAsset resource="video" />
      </>
    );
}
