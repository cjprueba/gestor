# Stage 1: Build
FROM node:20-alpine AS builder


WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm@10.13.1

# Copia los archivos de dependencias
COPY package.json ./
COPY pnpm-lock.yaml ./

# Instala dependencias
RUN pnpm install --frozen-lockfile

# Copia el resto de la aplicación
COPY . .

# Construye la aplicación
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

# Copy built files to NGINX public folder
COPY --from=builder /app/dist /usr/share/nginx/html
    
# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
