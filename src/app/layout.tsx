import { AppProviders } from "@/components/providers/AppProviders";
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
  title: "Eddy Max Kilonzo — Portfolio",
  description:
    "Cybersecurity engineer and full-stack developer portfolio with secure systems, polished UX, and production-focused projects.",
  keywords: [
    "cybersecurity portfolio",
    "full-stack developer",
    "secure web engineering",
    "Next.js portfolio",
    "software engineer",
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
  openGraph: {
    title: "Eddy Max Kilonzo — Portfolio",
    description: "Security-first full-stack portfolio: cyber operations, web engineering, and polished product delivery.",
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
    title: "Eddy Max Kilonzo — Portfolio",
    description: "Security-first full-stack portfolio with cybersecurity and modern web engineering projects.",
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
      <body
        className={`${syne.variable} ${space.variable} ${jetbrains.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var mode=localStorage.getItem("portfolio-theme-mode-v1");var legacy=localStorage.getItem("portfolio-theme-v1");var isLight=mode==="light"||(mode!=="dark"&&mode!=="system"?(legacy==="light"):mode==="system"&&window.matchMedia("(prefers-color-scheme: light)").matches);document.documentElement.classList.toggle("light",!!isLight);document.documentElement.classList.toggle("theme-system",mode==="system");}catch(e){}})();`,
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
                  name: "Eddy Max Kilonzo",
                  url: "https://eddymax.dev",
                  jobTitle: "Software Engineer",
                  sameAs: [
                    "https://github.com/EddyKilonzo",
                    "https://www.linkedin.com/in/eddy-kilonzo-",
                  ],
                },
                {
                  "@type": "ItemList",
                  name: "Portfolio Projects",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Sentinel SIEM Playground" },
                    { "@type": "ListItem", position: 2, name: "Mesh API Gateway" },
                    { "@type": "ListItem", position: 3, name: "Aurora Portfolio Engine" },
                  ],
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  name: "CompTIA Security+",
                  recognizedBy: { "@type": "Organization", name: "CompTIA" },
                },
              ],
            }),
          }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
