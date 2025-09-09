import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared-layouts/LoadingSpinner';
import MyEventsWrapper from '../../../../../../components/admin/event-management/MyEventsWrapper';
import type { MyEventsPageProps, TabKey } from '../../../../../../components/admin/event-management/types';

export default async function MyEventsPage({ params, searchParams }: MyEventsPageProps) {
  const { userId } = await params;
  const { status } = await searchParams;
  
  const activeTab: TabKey = (status === 'active' || status === 'inactive') ? status : 'all';

  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MyEventsWrapper userId={userId} initialActiveTab={activeTab} />
    </Suspense>
  );
}
