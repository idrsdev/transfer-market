# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig.json ./
COPY .prettier* .eslint* ./

# Install ALL dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Set default environment
ENV NODE_ENV=production \
    PORT=5000

EXPOSE ${PORT}
CMD ["npm", "start"]