import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stash - Smart Spending Assistant",
  description: "Save smarter using agentic AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
