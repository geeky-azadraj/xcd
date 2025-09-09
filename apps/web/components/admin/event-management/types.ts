export type TabKey = 'all' | 'active' | 'inactive';

export interface MyEventsPageProps {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ status?: string }>;
}

export interface MyEventsWrapperProps {
  userId: string;
  initialActiveTab: TabKey;
}

export interface MyEventsContentProps {
  userId: string;
  initialActiveTab: TabKey;
  events?: any[]; // Array of events from API
}