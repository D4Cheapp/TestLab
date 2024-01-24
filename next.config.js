/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    prependData: `@import "src/styles/_variables.scss"; @import "src/styles/mixins.scss";`,
  },
  eslint: {
    dirs: ['src'],
  },
};

module.exports = nextConfig;
