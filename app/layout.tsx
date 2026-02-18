import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina RaaS – Results-as-a-Service",
  description:
    "We deliver complete software outcomes. Pay only when results are verified.",
  keywords: [
    "AI agents",
    "software startup",
    "SaaS",
    "workflow automation",
    "Results-as-a-Service",
  ],
  openGraph: {
    title: "Lumina RaaS – Build Faster with AI Agents",
    description:
      "Automate your entire software path from idea to launch. Pay only for delivered results.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
