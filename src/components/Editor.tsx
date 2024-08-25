"use client";

import React from "react";
import UploadImage from "./upload/UploadImage";
import Layers from "./layers/Layers";
import { ModeToggle } from "./theme/ModeToggle";
import ActiveImage from "./ActiveImage";

function Editor() {
  return (
    <div className="flex h-full">
      <div className="py-6 px-4 min-w-48 ">
        <div className="pb-12 text-center">
          <ModeToggle />
        </div>
      </div>
      <UploadImage />
      <ActiveImage />
      <Layers />
    </div>
  );
}

export default Editor;
