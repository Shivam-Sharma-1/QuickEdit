"use client";

import { useLayerStore } from "@/lib/layer-store";
import VideoTranscription from "./VideoTranscription";
import SmartCrop from "./SmartCrop";
import ExportAsset from "./ExportAsset";
import { User as UserData } from "@prisma/client";
import { User } from "next-auth";

function VideoTools({ user, userData }: { user: User; userData: UserData }) {
  const activeLayer = useLayerStore((state) => state.activeLayer);

  if (activeLayer.resourceType === "video")
    return (
      <>
        <VideoTranscription user={user!} userData={userData} />
        <SmartCrop user={user!} userData={userData} />
        <ExportAsset resource="video" />
      </>
    );
}

export default VideoTools;
