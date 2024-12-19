"use client";

import { useLayerStore } from "@/lib/layer-store";
import VideoTranscription from "./VideoTranscription";
import SmartCrop from "./SmartCrop";
import ExportAsset from "./ExportAsset";
import { useSession } from "next-auth/react";

export default function VideoTools() {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const { data: session } = useSession();

  if (activeLayer.resourceType === "video")
    return (
      <>
        <VideoTranscription />
        <SmartCrop user={session?.user!} />
        <ExportAsset resource="video" />
      </>
    );
}
