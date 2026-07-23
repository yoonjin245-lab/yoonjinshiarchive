import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yoonjin Shi Archive",
  description: "A minimal image archive of observations, sketches, drawings, renders, and completed work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="mx-auto min-h-screen w-full max-w-[1600px] px-5 pb-20 pt-28 sm:px-8 lg:px-10">
          {children}
        </main>
      </body>
    </html>
  );
}
