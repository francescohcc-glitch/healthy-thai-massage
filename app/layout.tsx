
import type { Metadata } from "next";
import "./globals.css";
import Analytics from "@/components/Analytics";

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

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Healthy Thai Massage — Relax. Restore. Rejuvenate.",
    description: "Your moment of tranquility on Westheimer Road, Houston.",
    images: [{ url: "/branding/social-preview.png", alt: "Healthy Thai Massage — Relax. Restore. Rejuvenate. Houston, Texas" }],
  },

  openGraph: {
    title: "Healthy Thai Massage — Relax. Restore. Rejuvenate.",
    description: "Your moment of tranquility on Westheimer Road, Houston.",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    images: [
      {
        url: "/branding/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Healthy Thai Massage — Relax. Restore. Rejuvenate. Houston, Texas",
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
      <body>{children}<Analytics/></body>
    </html>
  );
}
