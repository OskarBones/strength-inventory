FROM node:24.13.0-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages/schemas/package*.json ./packages/schemas/
COPY backend/package*.json ./backend/

RUN npm ci

COPY packages/schemas ./packages/schemas/
COPY backend ./backend/

WORKDIR /usr/src/app/backend
RUN npm run tsc

FROM node:24.13.0-alpine AS runner

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

COPY packages/schemas/package*.json ./packages/schemas/
COPY backend/package*.json ./backend/

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/packages/schemas ./packages/schemas/
COPY --from=builder /usr/src/app/backend/build ./backend/build/

USER node

EXPOSE 3000

WORKDIR /usr/src/app/backend
CMD ["node", "src/index.js"]