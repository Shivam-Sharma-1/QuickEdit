"use client";

import React from "react";
import { Button } from "../ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AuthPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session && session.user && session.user.email) {
    console.log("Unauthorized access");
    router.push("/");
  }

  return (
    <div className="w-full flex lg:grid grid-cols-2 justify-center h-screen">
      <div className="flex flex-col col-span-2 md:col-span-1 items-center justify-center py-12">
        <Link href="/" className="mb-12">
          Logo
        </Link>

        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login to your account</h1>
            <p className="text-balance text-xs text-muted-foreground">
              Continue with one of the OAuth Providers below
            </p>
          </div>
          <div className="grid gap-4">
            <Button
              onClick={() => signIn("google", { redirectTo: "/" })}
              variant="default"
              className="w-full flex flex-row gap-2"
            >
              Sign In with Google
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden md:col-span-1 bg-muted lg:block"></div>
    </div>
  );
};

export default AuthPage;
