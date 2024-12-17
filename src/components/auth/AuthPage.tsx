"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user && session.user.email) {
      router.push("/editor");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div
      className="w-full flex justify-center items-center min-h-[100svh] max-h-[100svh] px-2"
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "transparent",
      }}
    >
      <div className="flex flex-col items-center justify-center bg-background/50 shadow-xl backdrop-blur-lg h-fit px-6 py-8 sm:px-8 sm:py-12 rounded-xl">
        <div className="mx-auto grid w-full sm:w-[350px] gap-3 sm:gap-6">
          <Link href="/" className="mx-auto">
            <Image
              src={"/images/logo-full.svg"}
              width={180}
              height={36}
              className="object-cover shrink-0"
              alt="logo-full"
            />
          </Link>
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Sign in to your account
            </h1>
            <p className="text-balance text-sm text-muted-foreground">
              Continue with Google Sign In Below
            </p>
          </div>
          <Button
            onClick={handleSignIn}
            variant="default"
            className="w-full flex flex-row gap-2 mt-4"
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
