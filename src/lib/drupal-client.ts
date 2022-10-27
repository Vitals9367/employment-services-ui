import getConfig from 'next/config'
import { DrupalClient  } from 'next-drupal'
// import Redis from 'ioredis'

// const getRedis = () => {
//   const { REDIS_HOST, REDIS_PORT, REDIS_INSTANCE, REDIS_PASSWORD } = getConfig().serverRuntimeConfig

//   if (REDIS_INSTANCE) {
//     return new Redis({
//       sentinels: [
//         { host: REDIS_HOST, port: REDIS_PORT },
//       ],
//       password: REDIS_PASSWORD,
//       sentinelPassword: REDIS_PASSWORD,
//       name: REDIS_INSTANCE
//     })
//   }

//   // For local environment.
//   return new Redis({host: REDIS_HOST, port: REDIS_PORT})
// }

//const redis = getRedis()


// export const redisCache: DataCache = {
//   async set(key, value) {
//     return await redis.set(key, value)
//   },
//   async get(key) {
//     return await redis.get(key)
//   },
// }

export const getDrupalClient = (withAuth: boolean = false) => {
  const { NEXT_PUBLIC_DRUPAL_BASE_URL, DRUPAL_PREVIEW_SECRET, DRUPAL_CLIENT_ID, DRUPAL_CLIENT_SECRET } = getConfig().serverRuntimeConfig
  return new DrupalClient(
    NEXT_PUBLIC_DRUPAL_BASE_URL,
    {
      auth: {
        clientId: DRUPAL_CLIENT_ID,
        clientSecret: DRUPAL_CLIENT_SECRET
      },
      //cache: redisCache,
      previewSecret: DRUPAL_PREVIEW_SECRET,
      // Make preview work in development environment.
      forceIframeSameSiteCookie: process.env.NODE_ENV === 'development',
      ...(withAuth && { withAuth: true })
    }
  )
}
