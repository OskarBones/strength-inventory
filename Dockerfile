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
RUN --mount=type=secret,id=FRONTEND_SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
  npm run build:deploy

WORKDIR /usr/src/app/backend
RUN --mount=type=secret,id=BACKEND_SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
  npm run tsc

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
CMD ["node", "build/src/index.js"]