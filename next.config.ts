import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["chart.googleapis.com", "firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
