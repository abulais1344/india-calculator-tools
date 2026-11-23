/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Serve the static homepage at "/" directly (it declares "/" as canonical),
  // and send the old /home.html and /index.html addresses there permanently.
  rewrites: async () => ({
    beforeFiles: [{ source: '/', destination: '/home.html' }],
  }),
  redirects: async () => [
    { source: '/home.html', destination: '/', permanent: true },
  ],
  
  headers: async () => [
    {
      source: '/:path*',
      headers: [
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
};

module.exports = nextConfig;
