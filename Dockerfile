# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# Install pnpm and dependencies
RUN npm install -g pnpm@8.15.6 && \
    npm install -g typescript && \
    pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Add types for Node.js to the web app specifically
RUN cd apps/web && pnpm add -D @types/node

# Add missing dependencies to the web app
RUN cd apps/web && pnpm add -D path-browserify @tailwindcss/vite @vitejs/plugin-react @tanstack/router-plugin

# Build the application
RUN pnpm run build

# Stage 2: Serve with NGINX
FROM registry.access.redhat.com/ubi8/nginx-120:latest

# Create directories with permissions that work with random UIDs
USER root
RUN mkdir -p /var/cache/nginx/client_temp && \
    chmod -R 777 /var/cache/nginx && \
    chmod -R 777 /var/run && \
    chmod -R 777 /var/log/nginx

# Copy your custom configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files to NGINX public folder - use the correct path
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
    
# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
