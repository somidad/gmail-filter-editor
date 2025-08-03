import type { NextConfig } from "next";
import { env } from "process";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: env.NODE_ENV === "production" ? "docs" : ".next",
};

export default nextConfig;
