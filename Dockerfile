FROM node:24.13.0-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages/schemas/package*.json ./packages/schemas/
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm ci

COPY packages/schemas ./packages/schemas/
COPY frontend ./frontend/
COPY backend ./backend/

WORKDIR /usr/src/app/frontend
RUN npm run build:deploy

WORKDIR /usr/src/app/backend
ARG BACKEND_SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${BACKEND_SENTRY_AUTH_TOKEN}
RUN npm run tsc

FROM node:24.13.0-alpine AS runner

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

COPY packages/schemas/package*.json ./packages/schemas/
COPY backend/package*.json ./backend/

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/packages/schemas ./packages/schemas/
COPY --from=builder /usr/src/app/backend/src/dist ./backend/dist/
COPY --from=builder /usr/src/app/backend/build ./backend/build/

USER node

EXPOSE 3000

WORKDIR /usr/src/app/backend
CMD ["node", "--import", "./build/instrument.js", "build/src/index.js"]