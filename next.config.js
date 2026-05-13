/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
        {
          key: 'Pragma',
          value: 'no-cache',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],

  redirects: async () => [
    {
      source: '/blog',
      destination: '/blog/index.html',
      permanent: false,
    },
  ],

};

module.exports = nextConfig;
