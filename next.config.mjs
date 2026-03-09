/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  /**
   * Disable Next.js image optimization in development to prevent stale cached images.
   * During development, images are re-downloaded from Notion and updated in public/images/,
   * but Next.js optimization cache would serve old versions. Production builds still benefit
   * from optimization for better performance.
   */
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  /**
   * Prevent browser and CDN caching of downloaded images in development.
   * Since images in public/images/ are refreshed at build time from the Notion API,
   * cached versions would prevent developers from seeing updates without a full rebuild.
   * This only applies in development; production caching is handled separately by CDN config.
   */
  async headers() {
    if (process.env.NODE_ENV !== 'development') return []
    return [
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ]
  },
}

export default nextConfig
