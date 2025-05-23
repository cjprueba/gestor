# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM docker.io/library/nginx:latest

# Create directories with permissions that work with random UIDs
RUN mkdir -p /var/cache/nginx/client_temp && \
    chmod -R 777 /var/cache/nginx && \
    chmod -R 777 /var/run && \
    chmod -R 777 /var/log/nginx

# Copy your custom configuration that works with read-only filesystem
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure the entrypoint can run with random UID
RUN chmod -R 777 /docker-entrypoint.d/ && \
    chmod 777 /docker-entrypoint.sh

USER 1001

# Copy built files to NGINX public folder
COPY --from=builder /app/dist /usr/share/nginx/html

    
# Copy custom NGINX config (optional, see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
