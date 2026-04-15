import type { Metadata } from "next";
import "./globals.css";

// 🔧 CUSTOMIZE: Change these for your business
export const metadata: Metadata = {
  title: "Your Business Name",
  description: "Your business tagline goes here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
