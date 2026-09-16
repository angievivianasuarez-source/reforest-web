FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_SERVICIOS_URL=https://reforestapi.codeconheiner.com
ARG VITE_API_AUTH_URL=https://auth.codeconheiner.com
ENV VITE_API_SERVICIOS_URL=$VITE_API_SERVICIOS_URL
ENV VITE_API_AUTH_URL=$VITE_API_AUTH_URL

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
