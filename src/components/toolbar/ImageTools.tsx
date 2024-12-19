import React from "react";
import GenRemove from "./GenRemove";
import BgRemove from "./BgRemove";
import BgReplace from "./BgReplace";
import GenFill from "./GenFill";
import ExtractPart from "./ExtractPart";
import ExportAsset from "./ExportAsset";
import { useSession } from "next-auth/react";

function ImageTools() {
  const { data: session } = useSession();

  return (
    <>
      <GenRemove user={session?.user!} />
      <BgRemove user={session?.user!} />
      <BgReplace user={session?.user!} />
      <GenFill user={session?.user!} />
      <ExtractPart user={session?.user!} />
      <ExportAsset resource="image" />
    </>
  );
}

export default ImageTools;
