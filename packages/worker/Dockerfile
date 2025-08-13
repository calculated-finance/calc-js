# Multi-stage build for Node.js worker
FROM node:20.18.0-alpine3.19 AS base

# Install security updates and dumb-init for proper signal handling
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Install pnpm directly instead of using corepack
RUN npm install -g pnpm@9.10.0

# Set working directory
WORKDIR /app

# Copy package manager configuration
COPY pnpm-*.yaml ./
COPY package.json ./

# Copy all package.json files for workspace dependencies
COPY packages/worker/package.json ./packages/worker/
COPY packages/domain/package.json ./packages/domain/

# Install dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile --production=false

# Build stage
FROM deps AS build

# Copy source code
COPY packages/worker/ ./packages/worker/
COPY packages/domain/ ./packages/domain/
COPY tsconfig*.json ./

# Build the worker and its dependencies
RUN pnpm --filter=@template/worker build

# Production stage
FROM node:20.18.0-alpine3.19 AS production

# Install security updates, dumb-init, and pnpm
RUN apk update && apk upgrade && apk add --no-cache dumb-init && \
    npm install -g pnpm@9.10.0

WORKDIR /app

# Copy package configuration
COPY pnpm-*.yaml ./
COPY package.json ./

# Copy built artifacts and package.json files
COPY --from=build /app/packages/worker/package.json ./packages/worker/
COPY --from=build /app/packages/worker/build/ ./packages/worker/build/
COPY --from=build /app/packages/domain/dist/ ./packages/domain/

# Install only production dependencies
RUN pnpm install --no-frozen-lockfile --production=true

# Create node_modules symlinks to make domain package available AFTER pnpm install
RUN mkdir -p ./packages/worker/node_modules/@template && \
    rm -rf ./packages/worker/node_modules/@template/domain && \
    ln -sf /app/packages/domain ./packages/worker/node_modules/@template/domain

# Create startup scripts
COPY packages/worker/scripts/ ./packages/worker/scripts/

# Set proper permissions for startup scripts
RUN chmod +x ./packages/worker/scripts/*.sh

# Create non-root user for security
RUN addgroup -g 1001 -S worker && \
    adduser -S worker -u 1001 -G worker

USER worker

# Default working directory for the worker
WORKDIR /app/packages/worker

# Default command (can be overridden in docker-compose or ECS)
CMD ["dumb-init", "./scripts/start-execute-triggers.sh"]
