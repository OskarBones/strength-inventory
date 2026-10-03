import { createRoot } from 'react-dom/client';

import * as Sentry from '@sentry/react';
import { createRouter } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

import AuthProvider from './AuthProvider';
import InnerApp from './InnerApp';
import { routeTree } from './routeTree.gen';
import { VERSION } from '@strength-inventory/schemas';

import './index.css';

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!  // Set by <AuthProvider> below
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

Sentry.init({
  // eslint-disable-next-line @stylistic/max-len
  dsn: 'https://ca0c2917d3c4f0facc4c55542f180429@o4512156987228160.ingest.de.sentry.io/4512157012197456',
  debug: import.meta.env.DEV,
  release: VERSION,
  environment: import.meta.env.DEV
    ? 'development'
    : 'production',
  tunnel: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/tunnel`
    : '/tunnel',
  integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
  tracesSampleRate: 1.0
});

const root = document.getElementById('root');

if (root) {
  createRoot(root, {
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
      console.warn('Uncaught error', error, errorInfo.componentStack);
    }),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler()
  }).render(
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

