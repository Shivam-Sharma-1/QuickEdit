"use client";

import { useEffect, useState } from "react";
import Layers from "./layers/Layers";
import { ModeToggle } from "./theme/ModeToggle";
import ActiveImage from "./ActiveImage";
import UploadForm from "./upload/UploadForm";
import { useLayerStore } from "@/lib/layer-store";
import ImageTools from "./toolbar/ImageTools";
import LoadingScreen from "./LoadingScreen";
import VideoTools from "./toolbar/VideoTools";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import getUser from "../../server/get-user";
import { Plan } from "@prisma/client";

interface User {
  name: string | null;
  image: string | null;
  email: string | null;
  id: string;
  emailVerified: Date | null;
  plan: Plan;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

function Editor() {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const { data: session } = useSession();
  const { name, image, email } = session?.user || {};

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        const userData = await getUser(email);
        setUser(userData);
      }
    };
    fetchUser();
  }, [email]);

  return (
    <div className="flex h-full">
      <div className="py-6 px-4 min-w-48 ">
        <div className="pb-12 text-center">
          <ModeToggle />
          <Button
            variant="ghost"
            onClick={() => signOut({ redirectTo: "/auth" })}
            className="px-2"
          >
            Log Out
            {name || "No"}
          </Button>

          <Sheet>
            <SheetTrigger>
              <Image
                className="h-6 w-6"
                src={image!}
                width={24}
                height={24}
                alt="Avatar"
              />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <Image
                    className="h-6 w-6"
                    src={image!}
                    width={24}
                    height={24}
                    alt="Avatar"
                  />
                  <h2>{name}</h2>
                  <p>{email}</p>
                </SheetTitle>
                <SheetDescription>
                  Number of credits : {user?.credits}/20
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex flex-col gap-4 ">
          {activeLayer.resourceType === "image" ? <ImageTools /> : null}
          {activeLayer.resourceType === "video" ? <VideoTools /> : null}
        </div>
      </div>
      <LoadingScreen />
      <UploadForm />
      <ActiveImage />
      <Layers />
    </div>
  );
}

export default Editor;
