import { useEffect, useState } from "react";
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
import getUser from "../../../server/get-user";
import { Plan } from "@prisma/client";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme/ModeToggle";
import { useLayerStore } from "@/lib/layer-store";
import { useTheme } from "next-themes";

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

function UserActions() {
  const { data: session } = useSession();
  const { name, image, email } = session?.user || {};
  const removeAllLayers = useLayerStore((state) => state.removeAllLayers);
  const { theme } = useTheme();

  const [user, setUser] = useState<User>();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (email) {
          const userData = await getUser(email);
          if (userData) {
            if (!("error" in userData)) {
              setUser(userData);
            } else {
              console.error("Error in fetching user:", userData.error);
            }
          }
        }
      } catch (error) {
        console.error("Error in fetching user:", error);
      }
    };
    fetchUser();
  }, [email, isProfileOpen]);

  const handleSignOut = () => {
    signOut({ redirectTo: "/auth" });
    removeAllLayers();
  };

  return (
    <div className="p-2 px-4 rounded-2xl text-center flex justify-center items-center gap-4 bg-background w-fit absolute top-4 z-10">
      <Image
        src={theme === "dark" ? "/logo-full.svg" : "/logo-full-black.svg"}
        width={120}
        height={36}
        className="rounded-full object-cover shrink-0 text-foreground"
        alt="logo-full"
      />
      <ModeToggle />
      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetTrigger className="shrink-0">
          <Image
            className="rounded-full object-cover shrink-0"
            src={image || "/default-avatar.png"}
            width={36}
            height={36}
            alt="Avatar"
          />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <Image
                className="h-6 w-6"
                src={image || "/default-avatar.png"}
                width={24}
                height={24}
                alt="Avatar"
              />
              <h3>{name}</h3>
              <p>{email}</p>
            </SheetTitle>
            <SheetDescription>
              Number of credits : {user?.credits}/20
              <Button variant="ghost" onClick={handleSignOut} className="px-2">
                Log Out
              </Button>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default UserActions;
