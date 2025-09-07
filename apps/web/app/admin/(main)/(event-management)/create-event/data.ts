// Dummy data for create event flow

export interface EventTemplate {
  id: string
  name: string
  type: string
  description: string
  category: string
  estimatedDuration: string
  defaultCapacity: number
}

export const eventTemplates: EventTemplate[] = [
  {
    id: "template-1",
    name: "TedX Conference",
    type: "Conference",
    description: "Inspiring talks and networking opportunities",
    category: "Technology",
    estimatedDuration: "1 day",
    defaultCapacity: 500
  },
  {
    id: "template-2", 
    name: "Music Festival",
    type: "Festival",
    description: "Multi-day music and entertainment event",
    category: "Entertainment",
    estimatedDuration: "3 days",
    defaultCapacity: 5000
  },
  {
    id: "template-3",
    name: "Business Summit",
    type: "Summit", 
    description: "Professional networking and business development",
    category: "Business",
    estimatedDuration: "2 days",
    defaultCapacity: 300
  },
  {
    id: "template-4",
    name: "Art Exhibition",
    type: "Exhibition",
    description: "Contemporary art showcase and gallery opening",
    category: "Arts",
    estimatedDuration: "1 week",
    defaultCapacity: 200
  },
  {
    id: "template-5",
    name: "Sports Tournament",
    type: "Tournament",
    description: "Competitive sports event with multiple categories",
    category: "Sports", 
    estimatedDuration: "5 days",
    defaultCapacity: 1000
  }
]

export interface VenueLocation {
  id: string
  name: string
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  capacity: number
  type: string
}

export const sampleLocations: VenueLocation[] = [
  {
    id: "venue-1",
    name: "Convention Center Toronto",
    address: "255 Front St W, Toronto, ON M5V 2W6, Canada", 
    city: "Toronto",
    country: "Canada",
    latitude: 43.6426,
    longitude: -79.3871,
    capacity: 2000,
    type: "Convention Center"
  },
  {
    id: "venue-2", 
    name: "Hyatt Regency Toronto",
    address: "370 King St W, Toronto, ON M5V 1J9, Canada",
    city: "Toronto", 
    country: "Canada",
    latitude: 43.6448,
    longitude: -79.3933,
    capacity: 800,
    type: "Hotel"
  }
]

export interface ContactDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  supportUrl?: string
}

export interface CreateEventFormData {
  selectedTemplate?: EventTemplate
  eventName?: string
  eventType?: string
  startDate?: string
  endDate?: string
  location?: VenueLocation
  contactDetails?: ContactDetails
  currency?: string
  bookingStartDate?: string
  bookingEndDate?: string
}
