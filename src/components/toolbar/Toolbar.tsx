import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";

import ImageTools from "./ImageTools";
import UserActions from "./UserActions";
import VideoTools from "./VideoTools";
import getUser from "../../../server/get-user";


function Toolbar() {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        const user = await getUser(session.user.email);
        setUserData(user);
      }
    };
    fetchUserData();
  }, [session]);

  return (
    <div className="mt-16 flex flex-col gap-2">
      <UserActions />
      <div
        className={cn(
          "flex ml-4 mt-4 flex-col gap-2 bg-background items-center rounded-2xl p-2 w-fit",
          {
            hidden:
              activeLayer.resourceType !== "image" &&
              activeLayer.resourceType !== "video",
          }
        )}
      >
        {activeLayer.resourceType === "image" ? (
          <ImageTools user={session?.user!} userData={userData!} />
        ) : null}
        {activeLayer.resourceType === "video" ? (
          <VideoTools user={session?.user!} userData={userData!} />
        ) : null}
      </div>
    </div>
  );
}

export default Toolbar;
