# Stage 1: build
FROM node:22-alpine AS build
WORKDIR /app

RUN npm install -g npm@10.9.3

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: runtime Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
