# Työllisyyspalvelut site

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
Drupal integration is implemented using [next-drupal](https://next-drupal.org) module.

## Related repositories
- [Drupal employment services](https://github.com/City-of-Helsinki/drupal-employment-services)
- [Employment services content sync functions](https://github.com/City-of-Helsinki/employment-services-content-sync)

## Getting Started

To use right node version

```bash
nvm use
```

Install Yarn if not already installed


```bash
npm install -g yarn
```

Copy `.env.example` to .env.local. This is a `.gitignore`d local checkout's env file.

Required environment variables are

```env
NEXT_PUBLIC_DRUPAL_BASE_URL='https://url-to-site.com
NEXT_IMAGE_DOMAIN=image.domain.com
DRUPAL_SITE_ID=THE SITE ID HASH FROM DRUPAL INSTANCE
DRUPAL_FRONT_PAGE=/
DRUPAL_PREVIEW_SECRET=PREVIEW SECRET FROM DRUPAL INSTANCE
DRUPAL_CLIENT_ID=PREVIEW CLIENT ID HASH FROM DRUPAL INSTANCE
DRUPAL_CLIENT_SECRET=CLIENT_SECRET FROM DRUPAL INSTANCE

# Use this if your dev connection does not have a signed certificate
NODE_TLS_REJECT_UNAUTHORIZED=0

#Always make sure this is set to 0
NEXT_TELEMETRY_DISABLED=0
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run production server locally.

Ensure you have set next-drupal environment variables.
You may create a local `.env.producion` file using the `.env.example ` files

Make a build and start Nextjs server. See `localhost:3000`

```bash
yarn build && yarn start
```


### Run production server on local docker.

Build Dockerfile, start container. See `localhost:8080`

## next.config.js and getConfig

Dont use `{process.env}` directly in application runtime code.
Use ` next/config` `getConfig().serverRuntimeConfig` and `getConfig().publicRuntimeConfig` instead to avoid building env variables directly as strings to build files.

## Landing page

The root page of the site is mapped to a specific `node` in in drupal instance. The default value in drupal should be set to a Landing Page type, assumed `/landingpage`

Make sure your drupal instance contains one `Landing Page` with matching url to Drupal Basic Settings:: Front Page (`/landingpage` by convention).