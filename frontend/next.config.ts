import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/generate': ['./templates/**/*'],
    },
  },
};

export default nextConfig;
