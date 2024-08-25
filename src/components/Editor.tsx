"use client";

import React from "react";
import UploadImage from "./upload/UploadImage";
import Layers from "./layers/Layers";
import { ModeToggle } from "./theme/ModeToggle";

function Editor() {
  return (
    <div className="flex h-full">
      <div className="py-6 px-4 min-w-48 ">
        <div className="pb-12 text-center">
          <ModeToggle />
        </div>
      </div>
      <UploadImage />
      <Layers />
    </div>
  );
}

export default Editor;
