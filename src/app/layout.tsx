import { AppProviders } from "@/components/providers/AppProviders";
import { PageLoader } from "@/components/layout/PageLoader";
import { projects, profile } from "@/content/portfolio";
import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eddymax.dev"),
  title: "Eddy Max Kilonzo — Software Engineer & Cybersecurity",
  description:
    "Software engineer transitioning into cybersecurity — blue team, SOC, threat detection, and full-stack engineering portfolio.",
  keywords: [
    "software engineer",
    "cybersecurity portfolio",
    "SOC analyst",
    "blue team",
    "threat detection",
    "incident response",
    "full-stack engineer",
    "Next.js portfolio",
  ],
  authors: [{ name: "Eddy Max Kilonzo", url: "https://eddymax.dev" }],
  creator: "Eddy Max Kilonzo",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  manifest: "/manifest.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d1f1a" },
    { media: "(prefers-color-scheme: light)", color: "#f0f7f3" },
  ],
  openGraph: {
    title: "Eddy Max Kilonzo — Software Engineer & Cybersecurity",
    description: "Software engineer transitioning into cybersecurity — blue team, SOC, threat detection, and full-stack engineering portfolio.",
    url: "https://eddymax.dev",
    siteName: "EMK Portfolio",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Eddy Max Kilonzo portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eddy Max Kilonzo — Software Engineer & Cybersecurity",
    description: "Software engineer transitioning into cybersecurity — blue team, SOC, threat detection, and engineering projects.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external APIs used by live stats widgets */}
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://tryhackme.com" />
        {/* Shield badge images in About section */}
        <link rel="dns-prefetch" href="https://img.shields.io" />
      </head>
      <body
        className={`${syne.variable} ${space.variable} ${jetbrains.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem("portfolio-theme-mode-v1");var l=localStorage.getItem("portfolio-theme-v1");var isLight=m==="light"?true:m==="dark"?false:m==="system"?window.matchMedia("(prefers-color-scheme: light)").matches:l==="dark"?false:true;document.documentElement.classList.toggle("light",isLight);document.documentElement.classList.toggle("theme-system",m==="system");}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  name: profile.name,
                  url: "https://eddymax.dev",
                  email: profile.email,
                  jobTitle: "Software Engineer & Cybersecurity Specialist",
                  description: profile.subtitle,
                  sameAs: [
                    profile.social.github,
                    profile.social.linkedin,
                    profile.social.twitter,
                  ],
                },
                {
                  "@type": "ItemList",
                  name: "Portfolio Projects",
                  itemListElement: projects.map((p, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: p.title,
                    description: p.shortDescription,
                    url: p.liveUrl ?? `https://eddymax.dev/#projects`,
                  })),
                },
              ],
            }),
          }}
        />
        <PageLoader />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
