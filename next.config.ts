import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";
import { env } from "node:process";

const nextConfig = (phase: string): NextConfig => {
	const isProd =
		phase === PHASE_PRODUCTION_BUILD || env.NODE_ENV === "production";

	return {
		/* config options here */
		async headers() {
			return [
				{
					source: "/(.*)",
					headers: [
						{
							key: "Strict-Transport-Security",
							value: isProd
								? "max-age=31536000; includeSubDomains; preload"
								: "max-age=0",
						},
					],
				},
			];
		},
		output: "export",
		distDir: "docs",
	};
};

export default nextConfig;
