import { Gem } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { User } from ".";



interface ProfileSheetProps {
  user: User;
  name: string;
  image: string;
  email: string;
  theme?: string;
  handleSignOut: () => void;
}

const ProfileSheet = ({
  user,
  name,
  email,
  image,
  theme,
  handleSignOut,
}: ProfileSheetProps) => {
  return (
    <SheetContent className="flex flex-col gap-6">
      <SheetHeader>
        <SheetTitle>
          <Logo />
        </SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Image
              className="rounded-full"
              src={image || "/default-avatar.png"}
              width={38}
              height={38}
              alt="Avatar"
            />
            <div className="flex flex-col">
              <h3>{name}</h3>
              <p className="text-neutral-400 text-sm">{email}</p>
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-4">
            <div className="h-2 bg-secondary rounded-full">
              <div
                style={{ width: `${(user?.credits / 20) * 100}%` }}
                className="h-full rounded-[inherit] bg-[#f67127] transition-all duration-200 ease-in"
              />
            </div>
            <div className="flex justify-between items-center text-sm -mt-2">
              <p>Credits Remaining</p>
              <p>{user?.credits} / 20</p>
            </div>
            <div className="rounded-lg border p-4 px-6 flex flex-col justify-center items-center gap-3">
              <p className="text-sm">
                You have {user?.credits} credits remaining!
              </p>
              <p className="text-xs -mt-2 text-neutral-400">
                Upgrade to gain more credits
              </p>
              <Button className="font-semibold w-full gap-2 bg-[#f67127] text-white">
                <Gem className="h-5 w-5" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>
        <Button onClick={handleSignOut} className="font-semibold">
          Log Out
        </Button>
      </div>
    </SheetContent>
  );
};

export default ProfileSheet;
