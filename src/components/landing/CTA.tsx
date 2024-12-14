import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-muted">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Ready to Transform Your Content?
        </h2>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Join thousands of creators using QuickEdit to enhance their images and
          videos with AI-powered tools.
        </p>
        <Button size="lg">Get Started for Free</Button>
      </div>
    </section>
  );
}
