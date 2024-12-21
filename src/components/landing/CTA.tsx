import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import AnimatedGradientText from "../ui/animated-gradient-text";
import SparklesText from "../ui/sparkles-text";

export default function CTA() {
  return (
    <section className="py-10 sm:py-24 px-6 bg-background bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-[cubic-bezier(0.4, 0, 0.2, 1)]">
      <div className="max-w-4xl mx-auto text-center">
        <SparklesText
          text="Ready to Transform Your Content?"
          className="text-3xl font-medium sm:text-4xl md:text-5xl text-center mb-4"
        />
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Join thousands of creators using QuickEdit
          <br /> to enhance their images and videos with AI-powered tools.
        </p>
        <Link
          href="/editor"
          className="bg-white rounded-xl h-fit w-fit p-0 flex justify-center items-center mx-auto"
        >
          <AnimatedGradientText className="bg-white rounded-[inherit] w-fit">
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent rounded-[inherit] px-4 py-1 text-md lg:text-lg`
              )}
            >
              Get Started For Free
            </span>
          </AnimatedGradientText>
        </Link>
      </div>
    </section>
  );
}
