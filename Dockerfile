# ─────────────────────────────────────────────────────────────
#  Stage 1: build
#  CRA bakes REACT_APP_* vars into the JS bundle at compile time,
#  so they must arrive as build ARGs (not runtime ENV).
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG REACT_APP_SANITY_PROJECT_ID
ARG REACT_APP_SANITY_DATASET=production
ARG REACT_APP_EMAILJS_SERVICE_ID
ARG REACT_APP_EMAILJS_TEMPLATE_ID
ARG REACT_APP_EMAILJS_PUBLIC_KEY
ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_ANON_KEY

ENV REACT_APP_SANITY_PROJECT_ID=$REACT_APP_SANITY_PROJECT_ID \
    REACT_APP_SANITY_DATASET=$REACT_APP_SANITY_DATASET \
    REACT_APP_EMAILJS_SERVICE_ID=$REACT_APP_EMAILJS_SERVICE_ID \
    REACT_APP_EMAILJS_TEMPLATE_ID=$REACT_APP_EMAILJS_TEMPLATE_ID \
    REACT_APP_EMAILJS_PUBLIC_KEY=$REACT_APP_EMAILJS_PUBLIC_KEY \
    REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL \
    REACT_APP_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_ANON_KEY

COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────
#  Stage 2: serve with nginx
# ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
