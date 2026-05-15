import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Focus V Help Center — Guides, troubleshooting & support",
  description:
    "Find answers fast. Setup guides, troubleshooting, cleaning, warranty, and more for every Focus V device.",
  openGraph: {
    title: "Focus V Help Center",
    description:
      "Find answers fast. Setup guides, troubleshooting, and support for every Focus V device.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
