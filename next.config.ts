import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  output: "export",
  images: { unoptimized: true },
  distDir: "out",
  trailingSlash: true,
};

export default nextConfig;
