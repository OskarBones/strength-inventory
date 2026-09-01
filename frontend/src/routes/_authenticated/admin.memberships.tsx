import { createFileRoute } from '@tanstack/react-router';

import AdminMemberships
  from '@/components/personal/Admin/Memberships/Index';

export const Route = createFileRoute('/_authenticated/admin/memberships')({
  component: AdminMemberships
});
