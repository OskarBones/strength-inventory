import 'dotenv/config';

import * as Sentry from '@sentry/node'

import { VERSION } from '@strength-inventory/schemas';

const { NODE_ENV } = process.env

Sentry.init({
  dsn: 'https://6d9507cf45e1a5a699707d4c8f8dd612@o4512156987228160.ingest.de.sentry.io/4512185359138896',
  debug: NODE_ENV === 'development',
  release: VERSION,
  environment: NODE_ENV ?? NODE_ENV, // defaults to development or production depending on whether packaged
  integrations: [
    Sentry.expressIntegration({
      shouldHandleError(error) {
        const status = Number(error.status ?? error.statusCode ?? 500);
        // Capture 401/403 in addition to the default 5xx errors
        return status === 401 || status === 403 || status >= 500;
      },
    }),
  ],
  tracesSampleRate: 1.0
})