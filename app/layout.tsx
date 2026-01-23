import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Journal",
  description: "A daily journaling app with 15-minute writing sessions and 100 unique prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
