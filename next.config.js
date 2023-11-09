/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    prependData: `@import "src/app/_variables.scss";`
  },
  eslint: {
    dirs: ['src']
  }
};

module.exports = nextConfig;
