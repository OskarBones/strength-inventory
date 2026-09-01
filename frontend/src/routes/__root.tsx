import { createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import notFoundComponent from '@/components/root/NotFoundComponent';
import Root from '@/components/root/Root';

import { type AuthState } from '@strength-inventory/schemas';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  auth: AuthState
}>()({
  component: Root,
  notFoundComponent: notFoundComponent
});
