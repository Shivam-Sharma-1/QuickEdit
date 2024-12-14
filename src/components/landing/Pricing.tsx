import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <section id="pricing" className="py-24 px-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
        Simple, Transparent Pricing
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
        {tiers.map((tier, index) => (
          <Card
            key={index}
            className={tier.name === "Premium" ? "border-primary" : ""}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{tier.price}</p>
              <p className="text-sm text-gray-500">
                {tier.name === "Premium" ? "per month" : ""}
              </p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
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
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">{tier.cta}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
