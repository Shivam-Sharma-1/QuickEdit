"use client";

import { motion } from "framer-motion";
import {
  Crop,
  Eraser,
  FileOutput,
  FileVideo,
  ImageIcon,
  Replace,
  Subtitles,
  VideoIcon,
} from "lucide-react";
import { useEffect } from "react";
import React from "react";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { LampContainer } from "@/components/ui/lamp";
import { SparklesCore } from "@/components/ui/sparkles";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out QuickEdit",
    features: [
      "5 image edits per month",
      "Basic background removal",
      "720p video exports",
      "Community support",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    name: "Pro",
    price: "$15",
    description: "For power users and content creators",
    features: [
      "100 image edits per month",
      "Advanced background removal",
      "4K video exports",
      "Priority support",
      "Custom backgrounds",
      "Batch processing",
    ],
    buttonText: "Start Pro",
    buttonVariant: "default",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with custom needs",
    features: [
      "Unlimited edits",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Team management",
      "Advanced analytics",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
  },
];

export function PricingCards() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "relative rounded-2xl border p-8",
            tier.highlighted
              ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-900/20"
              : "border-border bg-card"
          )}
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold">{tier.name}</h3>
            <p className="mt-2 text-muted-foreground">{tier.description}</p>
            <p className="mt-4">
              <span className="text-4xl font-bold">{tier.price}</span>
              {tier.price !== "Custom" && (
                <span className="text-muted-foreground">/month</span>
              )}
            </p>
          </div>
          <ul className="mb-8 space-y-4">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <svg
                  className="h-4 w-4 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            variant={tier.buttonVariant as "outline" | "default"}
          >
            {tier.buttonText}
          </Button>
        </div>
      ))}
    </div>
  );
}


export default function Dummy() {
  const words = [
    {
      text: "Transform",
    },
    {
      text: "your",
    },
    {
      text: "content",
    },
    {
      text: "with",
    },
    {
      text: "QuickEdit",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  const features = [
    {
      title: "Background Removal",
      description: "Remove backgrounds from images with AI precision",
      icon: <Eraser className="h-6 w-6" />,
      className: "md:col-span-1",
    },
    {
      title: "Object Removal",
      description: "Intelligently remove unwanted objects from images",
      icon: <ImageIcon className="h-6 w-6" />,
      className: "md:col-span-1",
    },
    {
      title: "Background Replace",
      description: "Replace image backgrounds with AI-generated alternatives",
      icon: <Replace className="h-6 w-6" />,
      className: "md:col-span-1",
    },
    {
      title: "Export Options",
      description: "Export your edited content in various sizes and formats",
      icon: <FileOutput className="h-6 w-6" />,
      className: "md:col-span-1",
    },
    {
      title: "Smart Video Crop",
      description: "Automatically crop videos while keeping important content",
      icon: <Crop className="h-6 w-6" />,
      className: "md:col-span-1",
    },
    {
      title: "Video Transcription",
      description: "Generate accurate transcriptions for your videos",
      icon: <Subtitles className="h-6 w-6" />,
      className: "md:col-span-1",
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section */}
      <LampContainer>
        <motion.h1
          className="mt-8 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AI-Powered Image & Video Editing
        </motion.h1>
      </LampContainer>

      {/* Animated Text */}
      <div className="flex flex-col items-center justify-center h-[40rem]">
        <TypewriterEffect words={words} />
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Button variant="default" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            View Pricing
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <BentoGrid className="max-w-7xl mx-auto px-4">
        {features.map((feature, i) => (
          <BentoGridItem
            key={i}
            title={feature.title}
            description={feature.description}
            header={feature.icon}
            className={feature.className}
          />
        ))}
      </BentoGrid>

      {/* 3D Card Section */}
      <div className="flex items-center justify-center py-20">
        <CardContainer className="inter-var">
          <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              Premium Features
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              Unlock unlimited access to all editing features with our Premium
              plan
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>

      {/* Pricing Section */}
      <div className="py-20">
        <PricingCards />
      </div>

      <BackgroundBeams />

      {/* Sparkles Effect */}
      <div className="h-[40rem] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
      </div>
    </div>
  );
}
