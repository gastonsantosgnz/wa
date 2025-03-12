/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'randomuser.me'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 