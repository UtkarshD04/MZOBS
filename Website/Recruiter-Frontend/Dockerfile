# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY . .
RUN npm ci --no-audit --no-fund || (echo "--- npm debug log ---"; cat /root/.npm/_logs/*-debug-0.log; exit 1)

# Vite inlines these into the JS bundle at build time, so they must be
# passed as --build-arg (Dokploy: Build-time Arguments), not as runtime
# container env vars.
#   VITE_API_URL        employer API, e.g. https://api.example.com/api/employer
#   VITE_FILE_BASE_URL  backend host for resume/file links, e.g. https://api.example.com
#   VITE_LANDING_URL    marketing site (sign-in redirect), e.g. https://www.example.com
#   VITE_TALENT_SOURCE  'live' (real backend) or 'demo' (sample data)
ARG VITE_API_URL
ARG VITE_FILE_BASE_URL
ARG VITE_LANDING_URL
ARG VITE_TALENT_SOURCE=live
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_FILE_BASE_URL=${VITE_FILE_BASE_URL}
ENV VITE_LANDING_URL=${VITE_LANDING_URL}
ENV VITE_TALENT_SOURCE=${VITE_TALENT_SOURCE}

RUN npm run build

# ---- Serve ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
