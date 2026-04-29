import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eddy Max Kilonzo Portfolio",
    short_name: "EMK Portfolio",
    description: "Cybersecurity, software engineering, and web portfolio.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1f1a",
    theme_color: "#0d1f1a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
