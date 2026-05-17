import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "CareerOS – Map Your Tech Career",
  description:
    "CareerOS is the next-generation career roadmap and application tracker for IT & Tech students. Track applications, map skills, and land your dream role — without the chaos.",
  keywords: ["career tracker", "job applications", "tech career", "roadmap", "IT students"],
  authors: [{ name: "CareerOS" }],
  openGraph: {
    title: "CareerOS – Map Your Tech Career. Without the Chaos.",
    description: "Track applications, map skills, and land your dream role.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-zinc-950 text-zinc-50 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
