# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines these into the JS bundle at build time, so they must be
# passed as --build-arg, not as runtime container env vars.
ARG VITE_CONTACT_API_URL
ARG VITE_EMPLOYEE_API_URL
ARG VITE_EMPLOYEE_APP_URL
ARG VITE_EMPLOYER_API_URL
ARG VITE_EMPLOYER_APP_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_CONTACT_API_URL=${VITE_CONTACT_API_URL}
ENV VITE_EMPLOYEE_API_URL=${VITE_EMPLOYEE_API_URL}
ENV VITE_EMPLOYEE_APP_URL=${VITE_EMPLOYEE_APP_URL}
ENV VITE_EMPLOYER_API_URL=${VITE_EMPLOYER_API_URL}
ENV VITE_EMPLOYER_APP_URL=${VITE_EMPLOYER_APP_URL}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

RUN npm run build

# ---- Serve ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
