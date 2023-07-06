/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  generateEtags: false,
};

module.exports = nextConfig;
