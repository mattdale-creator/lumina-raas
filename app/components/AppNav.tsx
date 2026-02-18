"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/aether", label: "Aether" },
  { href: "/admin", label: "Admin" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center font-bold">
            L
          </div>
          <span className="font-semibold text-xl tracking-tighter">
            Lumina RaaS
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-violet-400 font-medium"
                  : "hover:text-violet-400 transition"
              }
            >
              {link.label}
            </Link>
          ))}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
