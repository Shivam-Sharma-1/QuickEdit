"use client";

import { User as UserData } from "@prisma/client";
import { Captions, Sparkles, WandSparkles } from "lucide-react";
import { User } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";



import decreaseCredits from "../../../server/decrease-credits";
import { initiateTranscription } from "../../../server/transcribe";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";



export default function VideoTranscription({
  user,
  userData,
}: {
  user: User;
  userData: UserData;
}) {
  const { activeLayer, updateLayer, setActiveLayer } = useLayerStore(
    (state) => ({
      activeLayer: state.activeLayer,
      updateLayer: state.updateLayer,
      setActiveLayer: state.setActiveLayer,
    })
  );
  const { generating, setGenerating } = useImageStore((state) => ({
    generating: state.generating,
    setGenerating: state.setGenerating,
  }));
  const [transcribing, setTranscribing] = useState(false);

  const handleTranscribe = async () => {
    if (!activeLayer.publicId || activeLayer.resourceType !== "video") {
      toast.error("Please select a video layer first");
      return;
    }

    setTranscribing(true);
    setGenerating(true);

    try {
      decreaseCredits(20, user.email!);

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
            <Popover>
              <TooltipTrigger>
                <PopoverTrigger disabled={!activeLayer?.url} asChild>
                  <Button variant="ghost" className="p-3 h-fit w-min">
                    <Captions size={20} />
                  </Button>
                </PopoverTrigger>
                {/* <Button
                  variant="ghost"
                  className="p-3 h-fit w-min"
                  onClick={handleTranscribe}
                  disabled={
                    transcribing || activeLayer.resourceType !== "video"
                  }
                >
                  <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                    <Captions size={18} />
                  </span>
                </Button> */}
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                Video Transcription
              </TooltipContent>
              <PopoverContent
                className="w-full p-6"
                side="right"
                sideOffset={16}
              >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      AI Video Transcriber
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Generate subtitles for the video.
                    </p>
                  </div>
                  <p className="text-xs flex  items-center gap-1">
                    Costs: 20 Credits <Sparkles size={14} />
                  </p>
                </div>
                {userData?.credits < 20 ? (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <Button
                          className="w-full mt-2 flex items-center justify-center gap-2"
                          disabled
                        >
                          Insufficient Credits <Sparkles size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={10}>
                        You need at least 20 credits to transcribe the video.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    className="w-full mt-2 flex items-center justify-center gap-2"
                    disabled={
                      userData?.credits < 20 || !activeLayer?.url || generating
                    }
                    onClick={handleTranscribe}
                  >
                    {generating ? "Transcribing..." : "Transcribe Video"}
                    <WandSparkles size={16} />
                  </Button>
                )}
              </PopoverContent>
            </Popover>
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
