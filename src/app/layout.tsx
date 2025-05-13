import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { Landing } from "@/components/Landing";

export const metadata: Metadata = {
  title: "Portfolio - Nathan Bonnell",
  description: "Site portfolio de Nathan Bonnell, développeur web fullstack.",
};

const montserrat = Montserrat({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${montserrat.className}`}
      >
        <Landing />
        {children}
      </body>
    </html>
  );
}
