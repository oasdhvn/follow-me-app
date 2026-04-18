/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['z-ai-web-dev-sdk'],
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
