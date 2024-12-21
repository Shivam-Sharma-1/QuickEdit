"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export default function ExportAsset({ resource }: { resource: string }) {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const [selected, setSelected] = useState("original");

  const handleDownload = async () => {
    if (activeLayer?.publicId) {
      try {
        const res = await fetch(
          `/api/download?publicId=${activeLayer.publicId}&quality=${selected}&resource_type=${activeLayer.resourceType}&format=${activeLayer.format}&url=${activeLayer.url}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch image URL");
        }
        const data = await res.json();
        console.log(data);
        if (data.error) {
          throw new Error(data.error);
        }

        // Fetch the image
        const imageResponse = await fetch(data.url);
        if (!imageResponse.ok) {
          throw new Error("Failed to fetch image");
        }
        const imageBlob = await imageResponse.blob();

        // Create a download link and trigger the download
        const downloadUrl = URL.createObjectURL(imageBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL
        URL.revokeObjectURL(downloadUrl);
        toast.success("Downloaded successfully");
      } catch (error) {
        toast.error("Download failed");
        console.error("Download failed: ", error);
      }
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <Dialog>
          <TooltipTrigger>
            <DialogTrigger disabled={!activeLayer?.url} asChild>
              <Button variant="ghost" className="p-3 h-fit w-min">
                <Download size={18} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Export
          </TooltipContent>
          <DialogContent>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-center text-2xl font-medium">
                  Export the {resource}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Export assets efficiently for use in your projects.
                </p>
              </div>
              <div className="flex justify-center gap-4 flex-wrap">
                <Card
                  onClick={() => setSelected("original")}
                  className={cn(
                    selected === "original" ? "border-primary" : null,
                    "p-4 cursor-pointer text-center"
                  )}
                >
                  <CardContent className="p-0">
                    <CardTitle className="text-md">Original</CardTitle>
                    <CardDescription>
                      {activeLayer.width} X {activeLayer.height}
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card
                  onClick={() => setSelected("large")}
                  className={cn(
                    selected === "large" ? "border-primary" : null,
                    "p-4 cursor-pointer text-center"
                  )}
                >
                  <CardContent className="p-0">
                    <CardTitle className="text-md">Large</CardTitle>
                    <CardDescription>
                      {(activeLayer.width! * 0.7).toFixed(0)} X{" "}
                      {(activeLayer.height! * 0.7).toFixed(0)}
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card
                  onClick={() => setSelected("medium")}
                  className={cn(
                    selected === "medium" ? "border-primary" : null,
                    "p-4 cursor-pointer text-center"
                  )}
                >
                  <CardContent className="p-0">
                    <CardTitle className="text-md">Medium</CardTitle>
                    <CardDescription>
                      {(activeLayer.width! * 0.5).toFixed(0)} X{" "}
                      {(activeLayer.height! * 0.5).toFixed(0)}
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card
                  className={cn(
                    selected === "small" ? "border-primary" : null,
                    "p-4 cursor-pointer text-center"
                  )}
                  onClick={() => setSelected("small")}
                >
                  <CardContent className="p-0">
                    <CardTitle className="text-md">Small</CardTitle>
                    <CardDescription>
                      {(activeLayer.width! * 0.3).toFixed(0)} X{" "}
                      {(activeLayer.height! * 0.3).toFixed(0)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Button
              onClick={handleDownload}
              className="mt-2 flex justify-center items-center gap-2"
            >
              Download {selected} {resource} <Download size={18} />
            </Button>
          </DialogContent>
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
}
