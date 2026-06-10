/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "img.shields.io" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "skillicons.dev" },
    ],
  },
};

export default nextConfig;
