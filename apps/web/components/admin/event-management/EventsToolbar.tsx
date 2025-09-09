"use client"

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { mockEvents } from "@/app/admin/(main)/(event-management)/[userId]/my-events/data";
import { SearchWithSuggestions } from "@/components/shared-layouts/SearchWithSuggestions";
import { AddButton } from "@/components/shared-layouts/AddEventButton";

export type SortOption = "dateAdded" | "lastModified" | "upcoming";

interface EventsToolbarProps {
    onSearchChange?: (search: string) => void;
    onSortChange?: (sort: SortOption) => void;
}

function EventsToolbar({ onSearchChange, onSortChange }: EventsToolbarProps){

    const [iconUp, setIconUp] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("dateAdded");
    const [searchValue, setSearchValue] = useState("");

    const sortOptions = [{key: "dateAdded", label: "Date Added"}, {key:"lastModified", label: "Last Modified"}, {key: "upcoming", label: "Upcoming"}] as const;

    const currentSortLabel = sortOptions.find((option) => option.key === sortBy)?.label || "Date Added";

    // Calculate suggestions for search
    const searchSuggestions = useMemo(() => {
        if (!searchValue.trim()) return [];
        return mockEvents
            .filter(event => 
                event.eventName.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map(event => event.eventName);
    }, [searchValue]);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        onSearchChange?.(value);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchValue(suggestion);
        onSearchChange?.(suggestion);
        // TODO: Add routing logic here when clicking on a suggestion
        // Example: router.push(`/admin/events/${eventId}`)
    };

    const handleSortChange = (newSort: SortOption) => {
        setSortBy(newSort);
        setIconUp(!iconUp);
        onSortChange?.(newSort);
    };

    const handleAddEvent = () => {
        console.log("New Event Added");
        // TODO: Navigate to create event page
    };

    return(
        <div className="flex justify-between px-[150px] py-4"> 
            <SearchWithSuggestions
                suggestions={searchSuggestions}
                searchValue={searchValue}
                onSearchValueChange={setSearchValue}
                onSearchChange={handleSearchChange}
                onSuggestionClick={handleSuggestionClick}
            />
           
            <div className="flex gap-4 items-center">
                {/** Sort Dropdown */}
                <DropdownMenu onOpenChange={setIconUp}>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="h-[48px] w-[228px] px-4 bg-white border border-gray-300 shadow-lg shadow-gray-300 hover:bg-gray-50 flex items-center gap-2 focus-visible:ring-0" 
                        >
                            <ArrowUpDown className="h-4 w-4 text-black" />
                            <span className="text-gray-500 text-base font-thin ">
                                Sort by <span className="font-bold text-black text-base ml-1">{currentSortLabel}</span>
                            </span>
                            {iconUp ? (
                                <ChevronUp className="h-5 w-5 text-gray-800" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-800" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className=" w-[228px] max-h-48  overflow-y-auto p-2">
                        {sortOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.key}
                                onClick={() => handleSortChange(option.key)}
                                className={`cursor-pointer data-[highlighted]:bg-blue-200 hover:bg-blue-300 hover:ring-0 focus:outline-none flex items-center gap-3 p-4 rounded-lg ${
                                    sortBy === option.key ? "bg-gray-200" : ""
                                }`}
                            >
                                {/* Radio Button */}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    sortBy === option.key 
                                        ? "border-gray-600 bg-white" 
                                        : "border-gray-400 bg-white"
                                }`}>
                                    {sortBy === option.key && (
                                        <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                                    )}
                                </div>
                                <span className="text-base text-gray-800 font-medium">
                                    {option.label}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/** Add Event Button */}
                <AddButton
                    text="Add New Event"
                    onClick={handleAddEvent}
                />
            </div>
        </div>
    )
}

export default EventsToolbar;