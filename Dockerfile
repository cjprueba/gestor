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
FROM nginx:alpine
# Run as root (remove for production)
USER root

# Copy built files to NGINX public folder
COPY --from=builder /app/dist /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx
    
# Copy custom NGINX config (optional, see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
