/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {

  },

  async headers() {
    return [
      {
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
        source: '/(.*)',
      },
    ];
  },

  reactStrictMode: true,
  swcMinify: true,

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      exclude: /node_modules/,
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader'],
    });

    return config;
  },
};

module.exports = nextConfig;
