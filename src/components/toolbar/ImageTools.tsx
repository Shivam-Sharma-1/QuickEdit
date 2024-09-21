import React from "react";
import GenRemove from "./GenRemove";
import BgRemove from "./BgRemove";
import BgReplace from "./BgReplace";
import GenFill from "./GenFill";
import ExtractPart from "./ExtractPart";
import ExportAsset from "./ExportAsset";

function ImageTools() {
  return (
    <>
      <GenRemove />
      <BgRemove />
      <BgReplace />
      <GenFill />
      <ExtractPart />
      <ExportAsset resource="image" />
    </>
  );
}

export default ImageTools;
