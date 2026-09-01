import { createFileRoute } from '@tanstack/react-router';

import AdminLayoutComponent from '@/components/personal/Admin/Index';

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminLayoutComponent
});
