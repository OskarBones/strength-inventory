import { createFileRoute, redirect } from '@tanstack/react-router';

import Login from '@/components/authentication/Login';

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/'
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: search.redirect });
    }
  },
  component: Login
});
