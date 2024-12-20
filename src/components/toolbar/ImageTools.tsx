import React from "react";
import GenRemove from "./GenRemove";
import BgRemove from "./BgRemove";
import BgReplace from "./BgReplace";
import GenFill from "./GenFill";
import ExtractPart from "./ExtractPart";
import ExportAsset from "./ExportAsset";
import { User as UserData } from "@prisma/client";
import { User } from "next-auth";

function ImageTools({ user, userData }: { user: User; userData: UserData }) {
  console.log("imageTools", userData);
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
