# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Build the Vite application. Public VITE_* values are build-time settings;
# never pass database credentials or other secrets as build arguments.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS web-build

WORKDIR /app
ENV CI=true \
    npm_config_audit=false \
    npm_config_fund=false

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

ARG VITE_DATA_MODE=auto
ARG VITE_ADMIN_ENABLED=false
ARG VITE_SYNC_ENDPOINT=/api/sync-progress
ARG VITE_SITE_URL=
ARG VITE_SUPABASE_URL=
ARG VITE_SUPABASE_PUBLISHABLE_KEY=
ARG VITE_SUPABASE_ANON_KEY=
ARG VITE_BETTER_AUTH_URL=

ENV VITE_DATA_MODE=$VITE_DATA_MODE \
    VITE_ADMIN_ENABLED=$VITE_ADMIN_ENABLED \
    VITE_SYNC_ENDPOINT=$VITE_SYNC_ENDPOINT \
    VITE_SITE_URL=$VITE_SITE_URL \
    VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_BETTER_AUTH_URL=$VITE_BETTER_AUTH_URL

RUN npm run build

# ---------------------------------------------------------------------------
# Optional Node API target. Compose runs this beside the web target so the
# existing /api handlers retain Env-Gated Graceful Fallback behaviour.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS api

WORKDIR /app
ENV NODE_ENV=production \
    API_PORT=3001 \
    npm_config_audit=false \
    npm_config_fund=false

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --ignore-scripts

COPY api ./api
COPY server ./server
COPY shared ./shared
COPY certs ./certs

USER node
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3001/api/__health').then((r) => process.exit([404, 503].includes(r.status) ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server/dev-api.mjs"]

# ---------------------------------------------------------------------------
# Default image: serve the production build and proxy /api/* to the API
# service. If the API upstream is unavailable, the frontend keeps its
# existing graceful fallback to local mode.
# ---------------------------------------------------------------------------
FROM nginx:1.28-alpine AS web

ENV API_UPSTREAM=api:3001

COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=web-build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
