"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import Logo from "../Logo";
import { useSession } from "next-auth/react";
import ShineBorder from "../ui/shine-border";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-8 w-[80%] mx-auto z-50 rounded-full">
      <ShineBorder
        borderRadius={999999}
        className="bg-black text-white w-full justify-center flex flex-row items-center rounded-full px-12 py-4"
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        <Logo className="flex-1" />
        <nav className="space-x-4 flex-1 flex justify-center">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center justify-end space-x-4 flex-1">
          {session ? (
            <Link href="/editor">
              <Button variant="default" size="sm">
                Go to Editor
              </Button>
            </Link>
          ) : (
            <Link href="/auth">Sign In</Link>
          )}
        </div>
      </ShineBorder>
    </header>
  );
}
