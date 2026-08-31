# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY . .
RUN echo "--- env ---" && env | sort && \
    echo "--- npm config list -l (relevant) ---" && npm config list -l | grep -iE "lock|omit|include" && \
    echo "--- explicit package-lock value ---" && npm config get package-lock && \
    echo "--- node -p require path check ---" && node -p "require('fs').existsSync('/app/package-lock.json')" && \
    echo "--- realpath ---" && realpath package-lock.json
RUN npm ci --package-lock=true --no-audit --no-fund


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


FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
