import { createFileRoute } from '@tanstack/react-router';

import AdminGyms from '@/components/personal/Admin/Gyms/Index';

export const Route = createFileRoute('/_authenticated/admin/gyms')({
  component: AdminGyms
});
