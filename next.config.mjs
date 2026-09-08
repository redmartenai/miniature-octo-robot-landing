/** @type {import('next').NextConfig} */
const nextConfig = {
  /* The nature UI is the site. Serving it at / keeps it byte-for-byte —
     no port, no re-implementation, nothing to drift. */
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/auralis.html" }],
    };
  },
  reactStrictMode: true,
  /* lets a production build run without stomping the dev server's .next */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
