import { use } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { router } from './main';

import { AuthContext } from './utils/contexts';

const queryClient = new QueryClient();

export default function InnerApp () {
  const auth = use(AuthContext);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
    </QueryClientProvider>
  );
}
