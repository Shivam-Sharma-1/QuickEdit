"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import AnimatedGradientText from "../ui/animated-gradient-text";
import { LampContainer } from "../ui/lamp";
import Particles from "../ui/particles";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";

export default function Hero() {
  const words = [
    { text: "AI-Powered" },
    { text: "Image" },
    { text: "&" },
    { text: "Video" },
    { text: "Editor" },
  ];

  return (
    <section className="text-center relative">
      <LampContainer className="pt-10 sm:pt-0">
        <motion.div
          className="sm:mt-8 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-center font-medium tracking-tight text-transparent"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="mb-3 md:mb-8 mt-0 sm:mt-8 flex justify-center items-center">
            <TypewriterEffectSmooth words={words} className="font-bold" />
          </h1>
          <p className="mx-auto max-w-[70%] text-wrap sm:max-w-[700px] text-gray-400 text-md sm:text-lg md:text-xl tracking-normal">
            Transform your content with QuickEdit&apos;s advanced AI tools. Edit
            images and videos with ease, powered by Cloudinary AI.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 tracking-normal">
            <Link
              href="/editor"
              className="bg-white rounded-xl h-fit p-0 flex justify-center items-center"
            >
              <AnimatedGradientText className="bg-white rounded-[inherit]">
                <span
                  className={cn(
                    `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent rounded-[inherit] px-4 py-1 text-md sm:text-lg`
                  )}
                >
                  Get Started
                </span>
              </AnimatedGradientText>
            </Link>
          </div>
        </motion.div>
      </LampContainer>
      <div className="relative w-[350px] h-[160px] sm:w-[400px] sm:h-[180px] md:w-[600px] md:h-[280px] lg:w-[900px] lg:h-[420px] mx-auto -translate-y-64 sm:-translate-y-44 z-10 rounded-2xl border-2 border-gray-400 box-content">
        <Image
          src="https://res.cloudinary.com/dqiqi75hm/image/upload/v1734187202/quickedit/dp6y8s8dstqfpq7svmj5.png"
          alt="Hero Image"
          layout="fill"
          className="rounded-[inherit] object-cover"
        />
      </div>
      <Particles
        className="absolute inset-0"
        quantity={200}
        ease={80}
        color={"#ffffff"}
        refresh
      />
    </section>
  );
}
