import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/generate': ['./templates/**/*'],
  },
};

export default nextConfig;
