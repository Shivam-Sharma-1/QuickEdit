"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "../Logo";
import { useSession } from "next-auth/react";
import ShineBorder from "../ui/shine-border";
import Image from "next/image";
import { useResponsive } from "@/lib/hooks/useResponsive";

export default function Header() {
  const { data: session } = useSession();
  const isMobile = useResponsive();

  return (
    <header className="fixed sm:sticky top-8 sm:left-0 left-1/2 -translate-x-1/2 sm:translate-x-0 w-[90%] sm:w-[80%] mx-auto z-50 rounded-full">
      <ShineBorder
        borderRadius={999999}
        className="bg-gradient-to-r from-black via-gray-900 to-black text-white w-full justify-center flex flex-row items-center rounded-full px-8 sm:px-12"
        color={["#7c9ffe", "#FE8FB5", "#FFBE7B"]}
      >
        {isMobile ? (
          <Link href="/">
            <Image
              src={"/images/logo.svg"}
              width={30}
              height={30}
              className="object-cover shrink-0"
              alt="logo-full"
            />
          </Link>
        ) : (
          <Logo className="shrink-0" />
        )}

        <nav className="space-x-6 flex-1 flex justify-center">
          <Link
            href="#features"
            className="text-sm sm:text-[16px] font-medium text-muted-foreground hover:text-primary transition-all duration-200 ease-in"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm sm:text-[16px] font-medium text-muted-foreground hover:text-primary transition-all duration-200 ease-in"
          >
            Pricing
          </Link>
        </nav>

        {session ? (
          <Link href="/editor">
            <Button
              className="px-3 h-8 text-xs sm:text-sm sm:h-9 sm:px-6 rounded-lg"
              size="sm"
            >
              Editor
            </Button>
          </Link>
        ) : (
          <Link href="/auth">
            <Button
              className="px-3 h-8 text-xs sm:text-sm sm:h-9 sm:px-6 rounded-lg"
              size="sm"
            >
              Sign In
            </Button>
          </Link>
        )}
      </ShineBorder>
    </header>
  );
}
