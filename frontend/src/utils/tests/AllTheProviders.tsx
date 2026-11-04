import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const AllTheProviders = (
  { children }: { children: React.ReactNode }
) => {
  // make queryClient stable by using useState()
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
