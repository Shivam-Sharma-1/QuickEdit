"use client";

import { Button } from "@/components/ui/button";
import { useLayerStore } from "@/lib/layer-store";
import { useState } from "react";
import { Captions } from "lucide-react";
import { useImageStore } from "@/lib/image-store";
import { toast } from "sonner";
import { initiateTranscription } from "../../../server/transcribe";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VideoTranscription() {
  const { activeLayer, updateLayer, setActiveLayer } = useLayerStore(
    (state) => ({
      activeLayer: state.activeLayer,
      updateLayer: state.updateLayer,
      setActiveLayer: state.setActiveLayer,
    })
  );
  const setGenerating = useImageStore((state) => state.setGenerating);
  const [transcribing, setTranscribing] = useState(false);

  const handleTranscribe = async () => {
    if (!activeLayer.publicId || activeLayer.resourceType !== "video") {
      toast.error("Please select a video layer first");
      return;
    }

    setTranscribing(true);
    setGenerating(true);

    try {
      const result = await initiateTranscription({
        publicId: activeLayer.publicId,
        activeVideoName: activeLayer.name!,
      });
      if (result) {
        if (result.data && "success" in result.data) {
          if (result.data.url) {
            updateLayer({
              ...activeLayer,
              transcriptionURL: result.data.url,
            });
            setActiveLayer(activeLayer.id);
            toast.success("Video transcripted successfully");
          }
        } else if (result.data && "error" in result.data) {
          console.log("Error: ", result.data.error);
          toast.error(result.data.error);
        } else {
          toast.error("Unexpected response from server");
        }
      }
    } catch (error) {
      toast.error("An error occurred during transcription");
      console.error("Transcription error:", error);
    } finally {
      setTranscribing(false);
      setGenerating(false);
    }
  };

  return (
    <div className="flex items-center">
      {!activeLayer.transcriptionURL && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                className="p-3 h-fit w-min"
                onClick={handleTranscribe}
                disabled={transcribing || activeLayer.resourceType !== "video"}
              >
                <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                  <Captions size={18} />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              Video Transcription
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {activeLayer.transcriptionURL && (
        <Button className="py-8 w-full" variant={"outline"} asChild>
          <a
            href={activeLayer.transcriptionURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
              View Transcription
              <Captions size={18} />
            </span>
          </a>
        </Button>
      )}
    </div>
  );
}
