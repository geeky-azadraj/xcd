"use client"

import EventCard from "./EventCard";
import {useState, useEffect, useMemo} from "react"
import { LoadingSpinner } from "@/components/shared-layouts/LoadingSpinner"
import type { TabKey } from "@/components/admin/event-management/types"
import { SortOption } from "./EventsToolbar"

interface EventsGridProps {
    userId: string
    activeTab: TabKey
    searchQuery?: string
    sortBy?: SortOption
    events?: any[] // Array of events from API
}

function EventsGrid({ userId, activeTab, searchQuery = "", sortBy = "dateAdded", events }: EventsGridProps){

    const [isLoading, setIsLoading] = useState(true);
    // Use real events data from API
    const [eventsData, setEventsData] = useState<any[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1500);

            return () => clearTimeout(timer)
    },[])

    // Update events when events prop changes
    useEffect(() => {
        if (events && events.length > 0) {
            setEventsData(events)
        }
    }, [events])

    const handleActivate = (id: string) => {
        setEventsData(prevEvents => 
            prevEvents.map(event => 
                event.id === id ? { ...event, status: 'active' as const } : event
            )
        );
    }

    const handleDeactivate = (id: string) => {
        setEventsData(prevEvents => 
            prevEvents.map(event => 
                event.id === id ? { ...event, status: 'inactive' as const } : event
            )
        );
    }

    const handleDelete = (id: string) => {
        setEventsData(prevEvents => prevEvents.filter(event => event.id !== id));
    }

    // Filter and sort events based on active tab, search query, and sort option
    const filteredEvents = useMemo(() => {
        let filtered = eventsData;
        
        // Apply status filter
        switch (activeTab) {
            case 'active':
                filtered = filtered.filter(event => event.status === 'active');
                break;
            case 'inactive':
                filtered = filtered.filter(event => event.status === 'inactive');
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
    }, [eventsData, activeTab, searchQuery, sortBy]);

    // Handle loading state when events change
    useEffect(() => {
        if (events) {
            setIsLoading(false);
        }
    }, [events]);

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