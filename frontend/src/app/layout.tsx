import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teadustech SiteSpark | Website Demos in 60 Seconds",
  description: "Create a personalized website demo in 60 seconds with Teadustech SiteSpark.",
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
