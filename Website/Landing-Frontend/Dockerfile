# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY . .
RUN npm ci --no-audit --no-fund || (echo "--- npm debug log ---"; cat /root/.npm/_logs/*-debug-0.log; exit 1)


ARG VITE_CONTACT_API_URL
ARG VITE_EMPLOYEE_API_URL
ARG VITE_EMPLOYEE_APP_URL
ARG VITE_EMPLOYER_API_URL
ARG VITE_EMPLOYER_APP_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_PUBLIC_JOBS_API_URL
ARG VITE_MSG91_WIDGET_ID
ARG VITE_MSG91_TOKEN_AUTH
ENV VITE_CONTACT_API_URL=${VITE_CONTACT_API_URL}
ENV VITE_EMPLOYEE_API_URL=${VITE_EMPLOYEE_API_URL}
ENV VITE_EMPLOYEE_APP_URL=${VITE_EMPLOYEE_APP_URL}
ENV VITE_EMPLOYER_API_URL=${VITE_EMPLOYER_API_URL}
ENV VITE_EMPLOYER_APP_URL=${VITE_EMPLOYER_APP_URL}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
ENV VITE_PUBLIC_JOBS_API_URL=${VITE_PUBLIC_JOBS_API_URL}
ENV VITE_MSG91_WIDGET_ID=${VITE_MSG91_WIDGET_ID}
ENV VITE_MSG91_TOKEN_AUTH=${VITE_MSG91_TOKEN_AUTH}

# Builds dist/client (prerendered static pages + assets) and dist/server
# (the SSR bundle server.js loads at runtime) — see package.json's "build"
# script.
RUN npm run build


# ---- Run ----
# Nginx-only serving can't run server.js (SSR for /jobs/:id, the dynamic
# sitemap, and the prerendered-page routing all need a Node runtime) — this
# stage replaces the old nginx image with a slim Node one running the same
# server.js that `npm start` runs locally.
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY server.js ./
COPY src/lib ./src/lib
COPY --from=build /app/dist ./dist

# PUBLIC_JOBS_API_URL (no VITE_ prefix — this is the server process reading
# it at request time, not Vite inlining it into the client bundle) must be
# set at runtime, same value as VITE_PUBLIC_JOBS_API_URL above.
#
# Port 80 to match the old nginx image (see the removed nginx.conf) —
# whatever reverse proxy/port-mapping already points at this container on
# port 80 keeps working unchanged. Override PORT at runtime if needed.
ENV PORT=80
EXPOSE 80
CMD ["node", "server.js"]
