import { createFileRoute } from '@tanstack/react-router';

import About from '@/components/open/About/Index';

export const Route = createFileRoute('/_noAuth/(open)/about')({
  component: About
});
