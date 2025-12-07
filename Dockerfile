# Multi-stage Dockerfile for AI Blog Application
# Builds both frontend and backend in a single optimized container

# Stage 1: Build application
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Build frontend (Vite) and backend (esbuild)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
# These are needed for packages marked as "external" in esbuild
RUN npm ci --omit=dev && npm cache clean --force

# Copy the built application from builder stage
# dist/index.cjs - bundled server code
# dist/public - built frontend assets
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/articles || exit 1

# Start the server
CMD ["node", "dist/index.cjs"]
