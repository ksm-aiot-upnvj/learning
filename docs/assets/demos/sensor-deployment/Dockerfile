# AI Generated
FROM node:24-bookworm-slim AS web-build
WORKDIR /app
COPY sensor-deployment/frontend/package.json sensor-deployment/frontend/package-lock.json ./
RUN npm ci
COPY sensor-deployment/frontend/index.html sensor-deployment/frontend/main.js sensor-deployment/frontend/vite.config.mjs ./
COPY sensor-dashboard/App.vue ./
ENV VITE_SENSOR_API_URL=/api/sensors
RUN npm run build

FROM nginx:stable-alpine AS web
COPY --from=web-build /app/dist /usr/share/nginx/html
COPY sensor-deployment/nginx.conf /etc/nginx/conf.d/default.conf

FROM node:24-bookworm-slim AS api
WORKDIR /app
COPY sensor-deployment/backend/package.json sensor-deployment/backend/package-lock.json ./
RUN npm ci --omit=dev
COPY sensor-dashboard/dashboard-backend.cjs sensor-dashboard/validate-sensor.cjs ./
ENV HOST=0.0.0.0
USER node
CMD ["node", "dashboard-backend.cjs"]
