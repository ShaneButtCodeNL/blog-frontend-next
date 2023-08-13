/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/blogs/[pageNumber]",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
  generateEtags: false,
};

module.exports = nextConfig;
