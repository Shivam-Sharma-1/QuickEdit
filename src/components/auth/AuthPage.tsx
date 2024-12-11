"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layer, useLayerStore } from "@/lib/layer-store";
import getLayers from "../../../server/get-layers";

const AuthPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const setLayers = useLayerStore((state) => state.setLayers);

  useEffect(() => {
    if (session && session.user && session.user.email) {
      console.log("Authorized access, redirecting");
      router.push("/");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    try {
      const { layers } = await getLayers();
      console.log("Layers fetched:", layers);
      setLayers(layers as Layer[]);
      await signIn("google");
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

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
              onClick={handleSignIn}
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
