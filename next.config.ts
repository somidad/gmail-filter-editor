import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";
import { env } from "node:process";

const nextConfig = (phase: string): NextConfig => {
	const isProd =
		phase === PHASE_PRODUCTION_BUILD || env.NODE_ENV === "production";

	return {
		/* config options here */
		async headers() {
      const cspHeader = `
        default-src 'self';
        script-src 'self' https://apis.google.com https://accounts.google.com 'unsafe-inline';
        frame-src 'self' https://content.googleapis.com;
        connect-src 'self' https://gmail.googleapis.com;
        style-src 'self' 'unsafe-inline';
      `
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
            {
              key: 'Access-Control-Allow-Origin',
              value: isProd ? 'https://gfilter.app' : '*',
            },
            {
              key: "Content-Security-Policy",
              value: cspHeader.replace(/\s{2,}/g, " ").trim(),
            },
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin',
            }
					],
				},
			];
		},
		output: "export",
		distDir: "docs",
	};
};

export default nextConfig;
