import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { CardSpotlight } from "../ui/card-spotlight";
import SparklesText from "../ui/sparkles-text";

const tiers = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    features: ["20 credits", "Access to all tools", "Standard support"],
    cta: "Get Started",
  },
  {
    name: "Premium",
    description: "For power users and professionals",
    price: "$19.99",
    features: [
      "Unlimited credits",
      "Access to all tools",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Upgrade to Premium",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="pb-24 sm:py-24 px-6">
      <SparklesText
        text="Simple, Transparent Pricing"
        className="text-3xl font-medium sm:text-4xl md:text-5xl text-center mb-12"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
        {tiers.map((tier, index) => (
          <Card
            key={index}
            className={cn(
              tier.name === "Premium"
                ? "border-2 border-teal-900 bg-clip-border"
                : "h-full"
            )}
          >
            <CardSpotlight className="w-full h-full flex flex-col bg-gradient-to-br from-secondary to-secondary-dark">
              <CardHeader>
                <CardTitle className="z-20">{tier.name}</CardTitle>
                <CardDescription className="z-20">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <div className="flex flex-col justify-between flex-1">
                <CardContent className="flex-1">
                  <p className="text-4xl font-bold z-20">
                    <span className="z-30">{tier.price}</span>
                  </p>
                  <p className="text-sm text-gray-500 z-20">
                    {tier.name === "Premium" ? "per month" : ""}
                  </p>
                  <ul className="mt-4 space-y-2 z-20">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center z-20">
                        <svg
                          className="w-4 h-4 mr-2 text-green-500 z-20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="z-20">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {tier.name === "Premium" ? (
                    <Button className="w-full z-20">{tier.cta}</Button>
                  ) : (
                    <Link href="/editor" className="w-full z-20">
                      <Button className="w-full">{tier.cta}</Button>
                    </Link>
                  )}
                </CardFooter>{" "}
              </div>
            </CardSpotlight>
          </Card>
        ))}
      </div>
    </section>
  );
}
