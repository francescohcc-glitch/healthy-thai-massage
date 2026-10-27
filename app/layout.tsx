
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://healthythaimassagehouston.com";

export const metadata: Metadata = {
  title: "Healthy Thai Massage | A Relaxing Escape in Houston",
  description:
    "Make time for relaxation at Healthy Thai Massage on Westheimer Road in Houston. Explore massage options and call or text to request your appointment.",

  metadataBase: new URL(siteUrl),

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Healthy Thai Massage — Relax. Restore. Rejuvenate.",
    description: "Your moment of tranquility on Westheimer Road, Houston.",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    images: [
      {
        url: "/images/hero.jpg",
        width: 1800,
        height: 2400,
        alt: "Illustrative tranquil spa atmosphere",
      },
    ],
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
