import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import Pricing from "./Pricing";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
