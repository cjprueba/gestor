# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.25-alpine
RUN chmod -R g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN chown -R nginx:0 /usr/share/nginx/html && \
    chmod -R g+rwX /usr/share/nginx/html
    
# Clean default content
RUN rm -rf /usr/share/nginx/html/*

# Copy React build output
COPY --from=build /app/dist /usr/share/nginx/html
#RUN cp -r /app/dist /usr/share/nginx/html

# Remove default config and use a custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/my-app.conf

# Fix permission for client_temp
#RUN mkdir -p /var/cache/nginx/client_temp && \
#    chown -R nginx:nginx /var/cache/nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
