const { i18n } = require('./next-i18next.config')

const publicRuntimeConfig = {
  NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  NEXT_IMAGE_DOMAIN: process.env.NEXT_IMAGE_DOMAIN
}

const serverRuntimeConfig = {
  REVALIDATE_TIME: 20 //seconds
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  publicRuntimeConfig,
  serverRuntimeConfig,
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN, 'api.hel.fi'],
    deviceSizes: [576, 768, 992, 1200]
  }
}

module.exports = nextConfig
