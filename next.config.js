/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['z-ai-web-dev-sdk'],
  images: {
    unoptimized: true,
  },
}

// Cloudflare Pages 适配器
const withNextOnPages = require('@cloudflare/next-on-pages')({})

module.exports = process.env.CF_PAGES
  ? withNextOnPages(nextConfig)
  : nextConfig