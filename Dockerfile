FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built client
COPY --from=build /app/dist/public /usr/share/nginx/html

# Copy built server
COPY --from=build /app/dist /app/dist

# Copy node_modules from build stage (already has dependencies installed)
COPY --from=build /app/node_modules /app/node_modules

# Copy start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Install node for running the server
RUN apk add --no-cache nodejs npm

WORKDIR /app

EXPOSE 80

# Start both nginx and server
CMD ["/app/start.sh"]