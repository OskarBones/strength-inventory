import { createFileRoute, Outlet } from '@tanstack/react-router';

import syncToken from '@/utils/syncToken';

export const Route = createFileRoute('/_noAuth')({
  /* Force logout if there is no access token or
  the refresh token expires. */
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      await syncToken({
        refresh: context.auth.refresh, logout: context.auth.logout
      });
    }
  },
  component: () => <Outlet />
});
