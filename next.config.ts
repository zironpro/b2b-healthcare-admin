import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	experimental: {
		turbopackFileSystemCacheForBuild: true,
		turbopackFileSystemCacheForDev: true,
	},
};

export default nextConfig;
