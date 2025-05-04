import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nnptwwiepjyqtyfgsoxx.supabase.co",
        pathname: "/storage/v1/object/public/receipts/**",
      },
    ],
  },
};

export default nextConfig;
