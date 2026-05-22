import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uloumkiyptquokxaqscm.supabase.co",
      },
    ],
  },
};

export default nextConfig;