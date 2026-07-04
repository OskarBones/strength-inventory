import { createFileRoute } from '@tanstack/react-router';

import AdminDistricts from '../../components/personal/Admin/Districts/Index';

export const Route = createFileRoute('/_authenticated/admin/districts')({
  component: AdminDistricts
});
