/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }] },
  // Keep fortune TTF available to the serverless function if we ever read it from disk.
  experimental: {
    outputFileTracingIncludes: {
      "/api/fortune": ["./lib/fonts/**/*"],
    },
  },
};
module.exports = nextConfig;
