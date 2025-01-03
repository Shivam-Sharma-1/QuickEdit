import { User as UserData } from "@prisma/client";
import { User } from "next-auth";
import React from "react";

import BgRemove from "./BgRemove";
import BgReplace from "./BgReplace";
import ExportAsset from "./ExportAsset";
import ExtractPart from "./ExtractPart";
import GenFill from "./GenFill";
import GenRemove from "./GenRemove";

function ImageTools({ user, userData }: { user: User; userData: UserData }) {
  return (
    <>
      <GenRemove user={user!} userData={userData} />
      <BgRemove user={user!} userData={userData} />
      <BgReplace user={user!} userData={userData} />
      <GenFill user={user!} userData={userData} />
      <ExtractPart user={user!} userData={userData} />
      <ExportAsset resource="image" />
    </>
  );
}

export default ImageTools;
