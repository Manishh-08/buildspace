import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**" //allows from all the hosts
      },
      {
        protocol: "http",
        hostname: "**" //allows from all the hosts
      }
    ]
  }
};

export default nextConfig;
