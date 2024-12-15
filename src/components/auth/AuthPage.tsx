"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layer, useLayerStore } from "@/lib/layer-store";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import getLayers from "../../../server/get-layers";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const setLayers = useLayerStore((state) => state.setLayers);

  useEffect(() => {
    if (session && session.user && session.user.email) {
      router.push("/editor");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    try {
      const { layers } = await getLayers();
      console.log("handle sign in layers", layers);
      setLayers(layers as Layer[]);
      await signIn("google");
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div
      className="w-full flex justify-center items-center min-h-screen max-h-screen"
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "transparent",
      }}
    >
      <div className="flex flex-col items-center justify-center bg-background h-fit px-8 py-12 rounded-xl">
        <div className="mx-auto grid w-[350px] gap-8">
          <Link href="/">
            <Image
              src={"/images/logo-full.svg"}
              width={120}
              height={36}
              className="object-cover shrink-0"
              alt="logo-full"
            />
          </Link>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign in to your account</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Continue with Google Sign In Below
            </p>
          </div>
          <Button
            onClick={handleSignIn}
            variant="default"
            className="w-full flex flex-row gap-2"
          >
            Sign In with Google
            <FaGoogle />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
