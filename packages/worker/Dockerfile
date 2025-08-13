# Multi-stage build for Node.js worker
FROM node:20.19.1-alpine3.20 AS base

RUN npm install -g pnpm@9.10.0

WORKDIR /app

COPY pnpm-*.yaml package.json ./
COPY packages/worker/package.json ./packages/worker/
COPY packages/domain/package.json ./packages/domain/

FROM base AS build

RUN pnpm install --frozen-lockfile --production=false

COPY packages/worker/ ./packages/worker/
COPY packages/domain/ ./packages/domain/
COPY tsconfig*.json ./

RUN pnpm --filter=@template/domain build && \
    pnpm --filter=@template/worker build

FROM node:20.19.1-alpine3.20 AS production

RUN apk update && apk upgrade && apk add --no-cache dumb-init && \
    npm install -g pnpm@9.10.0 && \
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY pnpm-*.yaml package.json ./

COPY --from=build /app/packages/worker/package.json ./packages/worker/
COPY --from=build /app/packages/worker/build/ ./packages/worker/build/
COPY --from=build /app/packages/domain/dist/ ./packages/domain/

RUN pnpm install --production=true

COPY packages/worker/scripts/ ./packages/worker/scripts/
RUN chmod +x ./packages/worker/scripts/*.sh

RUN addgroup -g 1001 -S worker && \
    adduser -S worker -u 1001 -G worker

USER worker
WORKDIR /app/packages/worker

CMD ["dumb-init", "./scripts/start-execute-triggers.sh"]
