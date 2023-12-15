# =======================================
FROM node:16-alpine AS builder
# =======================================

ARG NEXT_PUBLIC_DRUPAL_BASE_URL
ARG NEXT_PUBLIC_DRUPAL_EDIT_URL
ARG NEXT_IMAGE_DOMAIN
ARG NEXT_PUBLIC_SITE_URL
ARG DRUPAL_FRONT_PAGE
ARG DRUPAL_SITE_ID
ARG DRUPAL_CLIENT_ID
ARG DRUPAL_PREVIEW_SECRET
ARG DRUPAL_CLIENT_SECRET

ARG MATOMO_SITE_ID
ARG MATOMO_URL
ARG ELASTICSEARCH_URL

ARG REDIS_HOST
ARG REDIS_INSTANCE
ARG REDIS_PASSWORD
ARG REDIS_PORT
ARG REDIS_PREFIX

ARG REACT_AND_SHARE_FI
ARG REACT_AND_SHARE_SV
ARG REACT_AND_SHARE_EN

ENV BUILD_PHASE 1
ENV NEXT_PUBLIC_DRUPAL_BASE_URL=$NEXT_PUBLIC_DRUPAL_BASE_URL
ENV NEXT_PUBLIC_DRUPAL_EDIT_URL=$NEXT_PUBLIC_DRUPAL_EDIT_URL
ENV NEXT_IMAGE_DOMAIN=$NEXT_IMAGE_DOMAIN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV DRUPAL_FRONT_PAGE=$DRUPAL_FRONT_PAGE
ENV DRUPAL_SITE_ID=$DRUPAL_SITE_ID
ENV DRUPAL_CLIENT_ID=$DRUPAL_CLIENT_ID
ENV DRUPAL_PREVIEW_SECRET=$DRUPAL_PREVIEW_SECRET
ENV DRUPAL_CLIENT_SECRET=$DRUPAL_CLIENT_SECRET
ENV NEXT_TELEMETRY_DISABLED 1

ENV MATOMO_SITE_ID=$MATOMO_SITE_ID
ENV MATOMO_URL=$MATOMO_URL
ENV ELASTICSEARCH_URL=$ELASTICSEARCH_URL

ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_INSTANCE=$REDIS_INSTANCE
ENV REDIS_PASSWORD=$REDIS_PASSWORD
ENV REDIS_PORT=$REDIS_PORT
ENV REDIS_PREFIX=$REDIS_PREFIX

ENV REACT_AND_SHARE_FI=$REACT_AND_SHARE_FI
ENV REACT_AND_SHARE_SV=$REACT_AND_SHARE_SV
ENV REACT_AND_SHARE_EN=$REACT_AND_SHARE_EN

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile && \
    yarn build && \
    rm -rf node_modules && \
    yarn install --production --ignore-scripts --prefer-offline

# =======================================
FROM node:16-alpine AS runner
# =======================================

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js
# env debug line for debugging environment variables in Azure.
# If you are sure if all env vars are available in both build- and runtime,
# copy .env.production to runner so that runtime can have new env vars from repo if needed
COPY --from=builder /app/.env.production .env.production

# node process user should be able to write to .next/*
RUN chmod -R a+rwx ./.next

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# We don't use it.
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 8080
ENV PORT=8080

CMD ["yarn", "start"]
