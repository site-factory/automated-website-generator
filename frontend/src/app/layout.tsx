import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuraGen | Automated High-Fidelity Website Demo Platform",
  description: "Get your personalized website demo in 60 seconds. Powered by AuraGen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
