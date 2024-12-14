import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="py-4 px-6 bg-background border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          QuickEdit
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost">Log in</Button>
          <Button>Sign up</Button>
        </div>
      </div>
    </header>
  );
}
