/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: 'build',
  sassOptions: {
    prependData: `@import "src/app/_variables.scss";`
  },
  eslint: {
    dirs: ['src']
  }
};

module.exports = nextConfig;
