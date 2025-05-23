# Stage 1: Build
#FROM node:18-alpine AS builder
FROM registry.access.redhat.com/ubi8/nodejs-20:latest AS builder
#FROM registry.access.redhat.com/ubi8/nodejs-18:latest AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile
RUN npm install -g typescript

COPY . .
RUN pnpm run build

# Stage 2: Serve with NGINX
#FROM docker.io/library/nginx:latest
#FROM registry.access.redhat.com/ubi8/nginx-120:latest
FROM registry.access.redhat.com/ubi8/nginx-120:latest

# para crear carpeta
USER root

# Create directories with permissions that work with random UIDs
RUN mkdir -p /var/cache/nginx/client_temp && \
    chmod -R 777 /var/cache/nginx && \
    chmod -R 777 /var/run && \
    chmod -R 777 /var/log/nginx

#USER 1001

# Copy your custom configuration that works with read-only filesystem
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure the entrypoint can run with random UID
#RUN chmod -R 777 /docker-entrypoint.d/ && \
#    chmod 777 /docker-entrypoint.sh



# Copy built files to NGINX public folder
COPY --from=builder /app/dist /usr/share/nginx/html

    
# Copy custom NGINX config (optional, see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]