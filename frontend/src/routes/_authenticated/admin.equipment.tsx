import { createFileRoute } from '@tanstack/react-router';

import AdminEquipment from '@/components/personal/Admin/Equipment/Index';

export const Route = createFileRoute('/_authenticated/admin/equipment')({
  component: AdminEquipment
});
