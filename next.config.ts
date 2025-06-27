import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        // Apply these headers to any route under `/api`
        source: "/api/doctor", // This applies to all API routes dynamically
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "false" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Or specify a specific domain for security
          { key: "Access-Control-Allow-Methods", value: "GET" },
          { key: "Access-Control-Allow-Headers", value: "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date" },
        ]
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ], // Add your image domain
  },
};

export default nextConfig;
