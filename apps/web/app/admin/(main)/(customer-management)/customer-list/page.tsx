"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ColumnDef, Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Pencil, ChevronRight, Search, Plus, X, Filter, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableWithPagination } from "@/components/TableAndPagination/DataTableWithPagination"
import { Input } from "@/components/ui/input"
import { AddEditCustomer } from "@/components/admin/CustomerManagement/AddEditCustomer"
import { ActionDialog } from "@/components/ActionDialog"
import { ActionsCell, CustomerLogo, FilterTag, StatusBadge, SummaryCard } from "@/components/admin/CustomerManagement/CustomerListComponents"
import { useApi } from "@/hooks/useApi"
import { useMutation, useQuery } from "@tanstack/react-query"
import { logError } from "@/lib/utils/logError"

// Dummy data type
export interface Customer {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive' | 'deleted'
  eventsCount: number
}

// Summary statistics type
interface SummaryStats {
  totalCustomers: string
  totalEvents: string
  activeCustomers: string
  inactiveCustomers: string
}

// Dummy data
const dummyData: Customer[] = [
  {
    id: '1',
    name: 'TEDx',
    logo: 'TEDx',
    status: 'active',
    eventsCount: 8
  },
  {
    id: '2',
    name: 'Spotify',
    logo: 'S',
    status: 'active',
    eventsCount: 12
  },
  {
    id: '3',
    name: 'Netflix',
    logo: 'N',
    status: 'active',
    eventsCount: 15
  },
  {
    id: '4',
    name: 'Visa',
    logo: 'V',
    status: 'active',
    eventsCount: 6
  },
  {
    id: '5',
    name: 'Microsoft',
    logo: 'M',
    status: 'inactive',
    eventsCount: 3
  },
  {
    id: '6',
    name: 'Bull',
    logo: 'BULL',
    status: 'active',
    eventsCount: 9
  },
  {
    id: '7',
    name: 'Google',
    logo: 'G',
    status: 'active',
    eventsCount: 11
  },
  {
    id: '8',
    name: 'Apple',
    logo: 'A',
    status: 'active',
    eventsCount: 7
  },
  {
    id: '9',
    name: 'Amazon',
    logo: 'AMZ',
    status: 'active',
    eventsCount: 14
  },
  {
    id: '10',
    name: 'Meta',
    logo: 'M',
    status: 'inactive',
    eventsCount: 2
  },
  {
    id: '11',
    name: 'Twitter',
    logo: 'T',
    status: 'active',
    eventsCount: 5
  },
  {
    id: '12',
    name: 'LinkedIn',
    logo: 'L',
    status: 'active',
    eventsCount: 8
  },
]

// Pre-calculated summary statistics
const summaryStats: SummaryStats = {
  totalCustomers: '12',
  totalEvents: '100',
  activeCustomers: '10',
  inactiveCustomers: '2'
}

// Dialog Type
export enum DialogType {
  EDIT_CUSTOMER = 'edit-customer',
  ADD_CUSTOMER = 'add-customer',
  DELETE_CUSTOMER = 'delete-customer',
  NONE = 'none'
}

const MainPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<2 | 10 | 20 | 50>(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [currentDialog, setCurrentDialog] = useState<DialogType>(DialogType.NONE)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  const { customers } = useApi();

  const { data: customersData } = useQuery({
    queryKey: ['all-customers-list'],
    queryFn: () => customers.customerControllerFindAllV1({
      page: currentPage,
      limit: itemsPerPage,
    }),
  })

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = dummyData;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === "oldest") {
      filtered = [...filtered].sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "events") {
      filtered = [...filtered].sort((a, b) => b.eventsCount - a.eventsCount);
    }

    return filtered;
  }, [dummyData, searchQuery, statusFilter, sortBy]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setItemsPerPage(pageSize as 10 | 20 | 50)
  }

  const handleRemoveStatusFilter = () => {
    setStatusFilter(null);
  };

  const handleSetCurrentDialog = (dialog: DialogType, customerId?: string) => {
    setCurrentDialog(dialog)
    if (customerId) {
      setSelectedCustomerId(customerId)
    }
  }

  // Define columns
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "CUSTOMER NAME",
      cell: ({ row }) => {
        const customer = row.original
        return <CustomerLogo logo={customer.logo} name={customer.name} />
      },
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "eventsCount",
      header: "NO. OF EVENTS",
      cell: ({ row }) => {
        const count = row.original.eventsCount
        return count > 0 ? count.toString().padStart(2, '0') : '-'
      },
    },
    {
      id: "actions",
      header: () => <div className="w-full text-right" style={{ paddingRight: '100px' }}>ACTIONS</div>,
      cell: ({ row }) => <ActionsCell setCurrentDialog={handleSetCurrentDialog} row={row} />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Customer Management</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="ALL CUSTOMERS" value={summaryStats.totalCustomers} />
          <SummaryCard title="EVENTS" value={summaryStats.totalEvents} />
          <SummaryCard title="ACTIVE CUSTOMERS" value={summaryStats.activeCustomers} />
          <SummaryCard title="IN-ACTIVE CUSTOMER" value={summaryStats.inactiveCustomers} />
        </div>

        {/* Control Bar */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-typography-500" />
              <Input
                placeholder="Search by customer name"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-4 h-12 border bg-white border-gray-300 rounded-lg focus:ring-0 focus:ring-none focus:border-none focus:outline-none"
              />
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 h-12 focus:ring-0 focus:ring-none focus:border-none focus:outline-none">
                    Sort by {sortBy === "newest" ? "Newest First" : sortBy === "oldest" ? "Oldest First" : sortBy === "name" ? "Name" : "Events"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("events")}>
                    Events
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 h-12">
                    <Filter className="h-4 w-4" />
                    Filter by Status
                    {statusFilter && <FilterTag label={statusFilter} onRemove={handleRemoveStatusFilter} />}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                    Inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add New Customer Button */}
              <Button 
                className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2 h-12 px-8"
                onClick={() => handleSetCurrentDialog(DialogType.ADD_CUSTOMER)}
              >
                <Plus className="h-4 w-4" />
                Add New Customer
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <DataTableWithPagination
            columns={columns}
            data={filteredAndSortedData}
            totalItems={filteredAndSortedData.length}
            pageNo={currentPage}
            itemsPerPage={itemsPerPage}
            onChange={handlePaginationChange}
            isLoading={false}
            rowClassName="hover:bg-gray-50 px-6 py-4 cursor-pointer bg-white"
            headerCellClassName="[&:nth-child(4)_div]:justify-end [&:nth-child(4)_div]:pr-0"
          />
        </div>

        {/* Add Edit Customer Dialog */}
        <AddEditCustomer 
          open={currentDialog === DialogType.ADD_CUSTOMER || currentDialog === DialogType.EDIT_CUSTOMER} 
          onOpenChange={(open) => {
            if (!open) {
              setCurrentDialog(DialogType.NONE)
              setSelectedCustomerId(null)
            }
          }} 
          type={currentDialog === DialogType.EDIT_CUSTOMER ? "edit" : "add"}
          customerId={selectedCustomerId}
        />

        {/* Delete Customer Dialog */}
        <ActionDialog
          open={currentDialog === DialogType.DELETE_CUSTOMER}
          onOpenChange={(open) => {
            if (!open) {
              setCurrentDialog(DialogType.NONE)
              setSelectedCustomerId(null)
            }
          }}
          // Confirmation step
          confirmationHeading="Delete Customer"
          confirmationDescription="Do you want to permanently delete this Customer? This action will cause the following:"
          confirmationBulletPoints={[
            'All data related to this Customer will be deleted',
          ]}
          confirmationCancelButtonLabel="Close"
          confirmationSuccessButtonLabel="Yes, delete it"
          destructive={true}
          // Success step
          successHeading="Customer Deleted!"
          successDescription={`You have deleted {name of customer} Customer`}
          successCloseButtonLabel="Close"
          // Error step
          errorHeading="Error!"
          errorDescription="An error occurred while deleting the customer."
          errorCancelButtonLabel="Close"
          // Empty onConfirm for now
          onConfirm={async () => {
            // TODO: Implement actual delete logic
            console.log('Delete customer:', selectedCustomerId)
          }}
          // Empty mutation for now
          mutation={{
            mutate: () => {},
            isPending: false,
            isSuccess: false,
            isError: false,
            error: null,
          }}
        />
      </div>
    </div>
  )
}

export default MainPage
