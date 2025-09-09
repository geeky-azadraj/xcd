import { useState } from "react";
import EventsToolbar, { SortOption } from "./EventsToolbar";
import EventsGrid from "./EventsGrid";
import type { TabKey } from "@/components/admin/event-management/types"

interface EventsBodyProps {
    userId: string
    activeTab: TabKey
    events?: any[] // Array of events from API
}

function EventsBody({ userId, activeTab, events }: EventsBodyProps){
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("dateAdded");

    return(
        <div >
            {/** Events Toolbar */}
           <div className="pt-5">
              <EventsToolbar 
                onSearchChange={setSearchQuery}
                onSortChange={setSortBy}
              />
           </div>

            {/** card Component will come here */}

            <div className="px-6">
                <EventsGrid 
                    userId={userId}
                    activeTab={activeTab} 
                    searchQuery={searchQuery}
                    sortBy={sortBy}
                    events={events}
                />
            </div>
        </div>
    )
}

export default EventsBody;