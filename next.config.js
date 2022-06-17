const { i18n } = require('./next-i18next.config')

const publicRuntimeConfig = {
  NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  NEXT_IMAGE_DOMAIN: process.env.NEXT_IMAGE_DOMAIN,
  MATOMO_SITE_ID: process.env.MATOMO_SITE_ID,
  MATOMO_URL: process.env.MATOMO_URL,
  REACT_AND_SHARE_FI: process.env.REACT_AND_SHARE_FI,
  REACT_AND_SHARE_SV: process.env.REACT_AND_SHARE_SV,
  REACT_AND_SHARE_EN: process.env. REACT_AND_SHARE_EN
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
