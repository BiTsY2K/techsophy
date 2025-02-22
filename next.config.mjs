/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "th.bing.com", // Replace with actual image host
      },
      {
        protocol: "https",
        hostname: "dz2cdn1.dzone.com", // Replace with actual image host
      },
    ],
  },
};

export default nextConfig;
