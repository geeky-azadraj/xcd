import { useState } from "react";
import EventsToolbar, { SortOption } from "./EventsToolbar";
import EventsGrid from "./EventsGrid";
import { TabKey } from "@/app/admin/(event-management)/[userId]/my-events/page"

interface EventsBodyProps {
    userId: string
    activeTab: TabKey
}

function EventsBody({ userId, activeTab }: EventsBodyProps){
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
                />
            </div>
        </div>
    )
}

export default EventsBody;