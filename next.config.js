/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/topics/react',
      },
    ];
  },
}

module.exports = nextConfig
