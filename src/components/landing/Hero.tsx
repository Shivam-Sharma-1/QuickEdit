"use client";

import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { LampContainer } from "../ui/lamp";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const words = [
    { text: "AI-Powered" },
    { text: "Image" },
    { text: "&" },
    { text: "Video" },
    { text: "Editor" },
  ];

  return (
    <section className="pt-8 px-6 text-center">
      <LampContainer>
        <motion.div
          className="mt-8 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="mb-8 mt-8 flex justify-center items-center">
            <TypewriterEffectSmooth
              words={words}
              className="text-4xl font-bold"
            />
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 tracking-normal">
            Transform your content with QuickEdit&apos;s advanced AI tools. Edit
            images and videos with ease, powered by Cloudinary AI.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 tracking-normal">
            <Button size="lg">Get Started</Button>
          </div>
        </motion.div>
      </LampContainer>
      <div className="relative w-[900px] mx-auto -translate-y-44 z-10 rounded-2xl h-[420px] border-2 border-gray-400 box-content">
        <Image
          src="https://res.cloudinary.com/dqiqi75hm/image/upload/v1734187202/quickedit/dp6y8s8dstqfpq7svmj5.png"
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          className="rounded-[inherit]"
        />
      </div>
    </section>
  );
}
