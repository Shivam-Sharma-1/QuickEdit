"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

interface LogoProps {
  className?: string;
}

function Logo({ className }: LogoProps) {
  const { theme } = useTheme();

  return (
    <Link href="/" className={className}>
      <Image
        src={
          theme === "light"
            ? "/images/logo-full-black.svg"
            : "/images/logo-full.svg"
        }
        width={120}
        height={36}
        className="object-cover shrink-0"
        alt="logo-full"
      />
    </Link>
  );
}

export default Logo;
