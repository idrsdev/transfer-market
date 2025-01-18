# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --registry=https://registry.npmjs.org/

# Copy source files
COPY . .

# Build-time arguments
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build application
RUN echo "Building with VITE_API_URL = ${VITE_API_URL}"
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]