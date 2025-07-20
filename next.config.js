/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [],
  },
  // Remove standalone for Railway
  // output: 'standalone',
  
  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Force static optimization
  trailingSlash: false,
  
  // Optimize for Railway
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig