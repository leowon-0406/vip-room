import type { NextConfig } from "next";
import path from "node:path";

// A parent folder may contain unrelated lockfiles; keep Turbopack scoped here.
const nextConfig: NextConfig = { reactStrictMode: true, turbopack: { root: path.resolve(__dirname) } };
export default nextConfig;
