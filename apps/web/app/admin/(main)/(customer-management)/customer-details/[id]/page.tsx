'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { DataTableWithPagination } from '@/components/TableAndPagination/DataTableWithPagination';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CustomerOverviewCard, PrimaryContactCard, CustomerDetailsHeader } from '@/components/admin/CustomerManagement/CustomerDetails';

// Mock data for the customer
export const mockCustomerData = {
  id: '1',
  name: 'UNESCO',
  imageUrl: '',
  status: 'ACTIVE',
  numberOfEvents: 8,
  location: 'Canada, USA',
  isEnabled: true,
  primaryContact: {
    name: 'Racheal Green',
    email: 'Racheal.green@email.com',
    phone: '+61 9876567895',
    location: 'Toronto, Canada'
  },
  events: [
    {
      id: '1',
      title: 'TedX Conference',
      type: 'Seminar',
      venue: 'Toronto, Canada',
      eventDates: '08 May 2025 - 10 May 2025',
      contactName: 'John Doe',
      contactEmail: 'John Doe@example.com',
      imageUrl: '/api/placeholder/40/40?text=🏢'
    },
    {
      id: '2',
      title: 'TEDX DESIGN EVENT',
      type: 'Seminar',
      venue: 'Toronto, Canada',
      eventDates: '08 May 2025 - 10 May 2025',
      contactName: 'John Doe',
      contactEmail: 'John Doe@example.com',
      imageUrl: '/api/placeholder/40/40?text=👁️'
    },
    {
      id: '3',
      title: 'TEDX RESEARCH',
      type: 'Seminar',
      venue: 'Toronto, Canada',
      eventDates: '08 May 2025 - 10 May 2025',
      contactName: 'John Doe',
      contactEmail: 'John Doe@example.com',
      imageUrl: '/api/placeholder/40/40?text=🔴'
    },
    {
      id: '4',
      title: 'TEDX INNOVATION',
      type: 'Seminar',
      venue: 'Toronto, Canada',
      eventDates: '08 May 2025 - 10 May 2025',
      contactName: 'John Doe',
      contactEmail: 'John Doe@example.com',
      imageUrl: '/api/placeholder/40/40?text=⬡'
    },
    {
      id: '5',
      title: 'TEDX MARITIME',
      type: 'Seminar',
      venue: 'Toronto, Canada',
      eventDates: '08 May 2025 - 10 May 2025',
      contactName: 'John Doe',
      contactEmail: 'John Doe@example.com',
      imageUrl: '/api/placeholder/40/40?text=🚢'
    },
    {
      id: '6',
      title: 'TEDX TARGET',
      type: 'Seminar',
      venue: 'Toronto, Canada',
      eventDates: '08 May 2025 - 10 May 2025',
      contactName: 'John Doe',
      contactEmail: 'John Doe@example.com',
      imageUrl: '/api/placeholder/40/40?text=🎯'
    }
  ]
};





// Event Table Columns
const eventColumns: ColumnDef<typeof mockCustomerData.events[0]>[] = [
  {
    accessorKey: 'title',
    header: 'TITLE & TYPE',
    cell: ({ row }) => (
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 rounded-sm">
          <AvatarImage className="rounded-none" src={row.original.imageUrl} alt={row.original.title} />
          <AvatarFallback className="text-lg w-full h-full rounded-none">
            {row.original.title.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900">{row.original.title}</p>
          <p className="text-sm text-gray-600">{row.original.type}</p>
        </div>
      </div>
    ),
    size: 300,
  },
  {
    accessorKey: 'venue',
    header: 'VENUE ADDRESS',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-gray-900">{row.original.venue}</span>
        <ExternalLink className="h-4 w-4 text-blue-600 cursor-pointer" />
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: 'eventDates',
    header: 'EVENT DATES',
    cell: ({ row }) => (
      <span className="text-gray-900">{row.original.eventDates}</span>
    ),
    size: 200,
  },
  {
    accessorKey: 'contactName',
    header: 'PRIMARY CONTACT DETAILS',
    cell: ({ row }) => (
      <div>
        <p className="text-gray-900">{row.original.contactName}</p>
        <p className="text-sm text-gray-600">{row.original.contactEmail}</p>
      </div>
    ),
    size: 250,
  },
];

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<10 | 20 | 50>(10);
  const [isEnabled, setIsEnabled] = React.useState(true);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size as 10 | 20 | 50);
  };

  const handleEnableToggle = (checked: boolean) => {
    setIsEnabled(checked);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <CustomerDetailsHeader customerId={params.id} />
        <div className="max-w-7xl mx-auto">
        
        {/* Customer Overview and Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CustomerOverviewCard 
          customer={mockCustomerData} 
          isEnabled={isEnabled}
          onEnableToggle={handleEnableToggle}
        />
          <PrimaryContactCard contact={mockCustomerData.primaryContact} />
        </div>
        
        {/* Events Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">List of Events</h3>
          </div>
          
          <DataTableWithPagination
            columns={eventColumns}
            data={mockCustomerData.events}
            totalItems={mockCustomerData.events.length}
            pageNo={currentPage}
            itemsPerPage={pageSize}
            onChange={handlePageChange}
            className="border-0"
          />
        </div>
      </div>
      </div>
    </div>
  );
}
