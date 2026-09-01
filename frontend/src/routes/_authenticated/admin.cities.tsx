import { createFileRoute } from '@tanstack/react-router';

import AdminCities from '@/components/personal/Admin/Cities/Index';

export const Route = createFileRoute('/_authenticated/admin/cities')({
  component: AdminCities
});
