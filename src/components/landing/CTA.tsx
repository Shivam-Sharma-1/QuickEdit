import { Button } from "@/components/ui/button";
import SparklesText from "../ui/sparkles-text";

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-muted">
      <div className="max-w-4xl mx-auto text-center">
        <SparklesText
          text="Ready to Transform Your Content?"
          className="text-3xl font-medium sm:text-4xl md:text-5xl text-center mb-4"
        />
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Join thousands of creators using QuickEdit
          <br /> to enhance their images and videos with AI-powered tools.
        </p>
        <Button size="lg">Get Started for Free</Button>
      </div>
    </section>
  );
}
