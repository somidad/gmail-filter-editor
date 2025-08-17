import type { NextConfig } from "next";
import { env } from "process";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: env.GITHUB_ACTIONS ? "docs" : ".next",
  // Truth table
  // production | GH workflow | distDir
  // -----------|-------------|----------------
  // false      | false       | .next
  // true       | false       | .next
  // false      | true        | d/c (docs)
  // true       | true        | docs
};

export default nextConfig;
