import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="py-24 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 mb-8">
        AI-Powered Image and Video Editing
      </h1>
      <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
        Transform your content with QuickEdit&apos;s advanced AI tools. Edit
        images and videos with ease, powered by Cloudinary AI.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
    </section>
  );
}
