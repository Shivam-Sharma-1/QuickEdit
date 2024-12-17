import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import getUser from "../../../../server/get-user";
import { Plan } from "@prisma/client";
import { ModeToggle } from "../../theme/ModeToggle";
import { useLayerStore } from "@/lib/layer-store";
import { useTheme } from "next-themes";
import ProfileSheet from "./ProfileSheet";
import Logo from "@/components/Logo";
import { toast } from "sonner";

export interface User {
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
  const { data: session, status } = useSession();
  const removeAllLayers = useLayerStore((state) => state.removeAllLayers);
  const { theme } = useTheme();

  const [user, setUser] = useState<User>();
  const [authUser, setAuthUser] = useState<{
    name: string;
    email: string;
    image: string;
  }>();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (authUser?.email) {
          const userData = await getUser(authUser?.email);
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
  }, [authUser?.email, isProfileOpen]);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("You have been signed out");
    }
    if (status === "authenticated") {
      setAuthUser({
        name: session!.user!.name || "",
        email: session!.user!.email || "",
        image: session!.user!.image || "",
      });
    }
  }, [status]);

  const handleSignOut = () => {
    signOut({ redirectTo: "/auth" });
    removeAllLayers();
  };

  return (
    <div className="ml-4 p-2 px-4 rounded-2xl text-center flex justify-center items-center gap-4 bg-background w-fit absolute top-4 z-10">
      <Logo />
      <ModeToggle />
      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetTrigger className="shrink-0">
          <Image
            className="rounded-full object-cover shrink-0"
            src={authUser?.image || "/default-avatar.png"}
            width={36}
            height={36}
            alt="Avatar"
          />
        </SheetTrigger>
        <ProfileSheet
          user={user!}
          handleSignOut={handleSignOut}
          name={authUser?.name!}
          image={authUser?.image!}
          email={authUser?.email!}
          theme={theme}
        />
      </Sheet>
    </div>
  );
}

export default UserActions;
