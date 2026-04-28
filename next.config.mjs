/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "img.shields.io" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
