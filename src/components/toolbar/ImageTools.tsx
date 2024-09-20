import React from "react";
import GenRemove from "./GenRemove";
import BgRemove from "./BgRemove";
import BgReplace from "./BgReplace";
import GenFill from "./GenFill";
import ExtractPart from "./ExtractPart";

function ImageTools() {
  return (
    <>
      <GenRemove />
      <BgRemove />
      <BgReplace />
      <GenFill />
      <ExtractPart />
    </>
  );
}

export default ImageTools;
