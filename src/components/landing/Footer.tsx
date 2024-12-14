import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-6 px-6 bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 QuickEdit. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link
            className="text-sm hover:underline underline-offset-4"
            href="mailto:shivamsharma77607@gmail.com"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
