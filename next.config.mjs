/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* lets a production build run without stomping the dev server's .next */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
