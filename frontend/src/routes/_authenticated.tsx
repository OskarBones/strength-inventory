import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import syncToken from '@/utils/syncToken';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href
        }
      });
    } else {
      await syncToken({
        refresh: context.auth.refresh, logout: context.auth.logout
      });
    }
  },
  component: () => <Outlet />
});
