const { i18n } = require('./next-i18next.config')

const serverRuntimeConfig = {
  REVALIDATE_TIME: 20, //seconds
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  serverRuntimeConfig,
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN],
  }
}

module.exports = nextConfig
