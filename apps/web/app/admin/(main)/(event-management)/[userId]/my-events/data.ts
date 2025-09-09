// Mock data for development and testing
// TODO: Remove this file once all components are using real API data

export interface MockEventData {
  id: string;
  eventName: string;
  status: 'ACTIVE' | 'INACTIVE';
  userId: string;
  createdAt: string;
  lastModified: string;
  eventStartDate: string;
  eventEndDate: string;
  location: string;
  description: string;
  imageUrl?: string;
}

export const mockEvents: MockEventData[] = [
  {
    id: '1',
    eventName: 'Tech Conference 2024',
    status: 'ACTIVE',
    userId: '550e8400-e29b-41d4-a716-446655440003',
    createdAt: '2024-01-15T10:00:00Z',
    lastModified: '2024-01-20T14:30:00Z',
    eventStartDate: '2024-03-15T09:00:00Z',
    eventEndDate: '2024-03-17T18:00:00Z',
    location: 'San Francisco, CA',
    description: 'Annual technology conference featuring the latest innovations',
    imageUrl: '/images/tech-conference.jpg'
  },
  {
    id: '2',
    eventName: 'Design Workshop',
    status: 'INACTIVE',
    userId: '550e8400-e29b-41d4-a716-446655440003',
    createdAt: '2024-01-10T08:00:00Z',
    lastModified: '2024-01-12T16:45:00Z',
    eventStartDate: '2024-02-20T10:00:00Z',
    eventEndDate: '2024-02-20T17:00:00Z',
    location: 'New York, NY',
    description: 'Interactive design workshop for beginners',
    imageUrl: '/images/design-workshop.jpg'
  },
  {
    id: '3',
    eventName: 'Marketing Summit',
    status: 'ACTIVE',
    userId: '550e8400-e29b-41d4-a716-446655440003',
    createdAt: '2024-01-05T12:00:00Z',
    lastModified: '2024-01-18T11:20:00Z',
    eventStartDate: '2024-04-10T08:00:00Z',
    eventEndDate: '2024-04-12T18:00:00Z',
    location: 'Chicago, IL',
    description: 'Digital marketing strategies and trends',
    imageUrl: '/images/marketing-summit.jpg'
  }
];

export const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440003',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/images/user-avatar.jpg'
};
