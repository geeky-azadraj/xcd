'use client';

import { useApi } from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/shared-layouts/LoadingSpinner';
import MyEventsContent from './MyEventsContent';
import type { MyEventsWrapperProps } from './types';

export default function MyEventsWrapper({ userId, initialActiveTab }: MyEventsWrapperProps) {
  const { event } = useApi();
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events", userId, initialActiveTab],
    queryFn: async () => {
      try {
        let allEvents = [];
        
        if (initialActiveTab === 'all') {
          // For 'all', fetch both active and inactive events
          
          const [activeResponse, inactiveResponse] = await Promise.all([
            event.eventControllerGetEventsByCustomerV1Raw({
              userId: userId,
              status: 'active'
            }),
            event.eventControllerGetEventsByCustomerV1Raw({
              userId: userId,
              status: 'inactive'
            })
          ]);
          
          const activeData = await activeResponse.raw.json();
          const inactiveData = await inactiveResponse.raw.json();
          
          const activeEvents = activeData?.data?.events || [];
          const inactiveEvents = inactiveData?.data?.events || [];
          
          allEvents = [...activeEvents, ...inactiveEvents];
          
        } else {
          // For 'active' or 'inactive', make single API call
          const response = await event.eventControllerGetEventsByCustomerV1Raw({
            userId: userId,
            status: initialActiveTab
          });
          
          const responseData = await response.raw.json();
          allEvents = responseData?.data?.events || [];
        
        }
        
        return allEvents;
      } catch (err) {
      
        throw err;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <LoadingSpinner className="w-20 h-20" />
      </div>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <MyEventsContent 
      userId={userId} 
      initialActiveTab={initialActiveTab}
      events={events || []}
    />
  );
}
