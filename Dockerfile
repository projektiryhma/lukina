# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY public/ public/
COPY src/ src/
COPY scripts/ scripts/
COPY .env ./
RUN npm run convert-data
RUN npm run build

FROM nginx:stable-alpine AS runner

COPY --from=builder /app/build /usr/share/nginx/html/lukina

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
