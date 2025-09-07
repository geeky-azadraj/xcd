"use client"

import EventCard from "./EventCard";
import { mockEvents, MockEventData } from "@/app/admin/(event-management)/[userId]/my-events/data";
import {useState, useEffect, useMemo} from "react"
import { LoadingSpinner } from "@/components/shared-layouts/LoadingSpinner"
import { TabKey } from "@/app/admin/(event-management)/[userId]/my-events/page"
import { SortOption } from "./EventsToolbar"

interface EventsGridProps {
    userId: string
    activeTab: TabKey
    searchQuery?: string
    sortBy?: SortOption
}

function EventsGrid({ userId, activeTab, searchQuery = "", sortBy = "dateAdded" }: EventsGridProps){

    const [isLoading, setIsLoading] = useState(true);
    // Filter initial events by userId
    const [events, setEvents] = useState<MockEventData[]>(
        mockEvents.filter(event => event.userId === userId)
    );

    useEffect(() => {
        const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1500);

            return () => clearTimeout(timer)
    },[])

    // Update events when userId changes
    useEffect(() => {
        setEvents(mockEvents.filter(event => event.userId === userId))
    }, [userId])

    const handleActivate = (id: string) => {
        setEvents(prevEvents => 
            prevEvents.map(event => 
                event.id === id ? { ...event, status: 'ACTIVE' as const } : event
            )
        );
    }

    const handleDeactivate = (id: string) => {
        setEvents(prevEvents => 
            prevEvents.map(event => 
                event.id === id ? { ...event, status: 'INACTIVE' as const } : event
            )
        );
    }

    const handleDelete = (id: string) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    }

    // Filter and sort events based on userId, active tab, search query, and sort option
    const filteredEvents = useMemo(() => {
        // TODO: When integrating with API, filtering and sorting will be done server-side
        // Example: GET /api/events?userId=user-123&status=active&search=tedx&sortBy=dateAdded
        
        let filtered = events; // events are already filtered by userId
        
        // Apply status filter
        switch (activeTab) {
            case 'active':
                filtered = filtered.filter(event => event.status === 'ACTIVE');
                break;
            case 'inactive':
                filtered = filtered.filter(event => event.status === 'INACTIVE');
                break;
            case 'all':
            default:
                // No filtering needed
                break;
        }
        
        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(event => 
                event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'dateAdded':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'lastModified':
                    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
                case 'upcoming':
                    return new Date(a.eventStartDate).getTime() - new Date(b.eventStartDate).getTime();
                default:
                    return 0;
            }
        });
        
        return sorted;
    }, [events, activeTab, searchQuery, sortBy]);

    // Simulate loading when filters change
    useEffect(() => {
        setIsLoading(true);
        // TODO: Replace with actual API call when integrating
        // Example: fetchEvents({ status: activeTab, search: searchQuery, sortBy })
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300); // Short delay to simulate API call

        return () => clearTimeout(timer);
    }, [activeTab, searchQuery, sortBy]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <LoadingSpinner className="w-20 h-20" />
            </div>
        )
    }

    return (
        <div className="px-[130px] py-4">
           {filteredEvents.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  gap-6"> 
                    {
                        filteredEvents.map((event) => {
                            return (
                                <EventCard 
                                    key={event.id}
                                    event={event}
                                    onActivate={handleActivate}
                                    onDeactivate={handleDeactivate}
                                    onDelete={handleDelete}
                                />
                            )
                        } )
                    }
               </div>
           ) : (
               <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                   <p className="text-lg">No events found</p>
                   {searchQuery && <p className="text-sm mt-2">Try adjusting your search criteria</p>}
               </div>
           )}
        </div>
    )
}

export default EventsGrid;