/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Skip static generation for admin routes
  async generateBuildId() {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig

