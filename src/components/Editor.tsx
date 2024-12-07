"use client";

import React from "react";
import Layers from "./layers/Layers";
import { ModeToggle } from "./theme/ModeToggle";
import ActiveImage from "./ActiveImage";
import UploadForm from "./upload/UploadForm";
import { useLayerStore } from "@/lib/layer-store";
import ImageTools from "./toolbar/ImageTools";
import LoadingScreen from "./LoadingScreen";
import VideoTools from "./toolbar/VideoTools";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";

function Editor() {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const { data: session } = useSession();

  return (
    <div className="flex h-full">
      <div className="py-6 px-4 min-w-48 ">
        <div className="pb-12 text-center">
          <ModeToggle />
          <Button
            variant="ghost"
            onClick={() => signOut({ redirectTo: "/auth" })}
            className="px-2"
          >
            Log Out
            {session?.user?.name || "No"}
          </Button>
        </div>
        <div className="flex flex-col gap-4 ">
          {activeLayer.resourceType === "image" ? <ImageTools /> : null}
          {activeLayer.resourceType === "video" ? <VideoTools /> : null}
        </div>
      </div>
      <LoadingScreen />
      <UploadForm />
      <ActiveImage />
      <Layers />
    </div>
  );
}

export default Editor;
