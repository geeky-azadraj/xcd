import { Customer, DialogType } from "@/app/admin/(main)/(customer-management)/customer-list/page";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronRight, MoreVertical, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Status badge component
export const StatusBadge = ({ status }: { status: 'active' | 'inactive' | 'deleted' }) => {
    const getStatusConfig = (status: string) => {
      switch (status) {
        case 'active':
          return {
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            dotColor: 'bg-green-500',
            borderColor: 'border-green-200',
            text: 'ACTIVE'
          };
        case 'inactive':
          return {
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-700',
            dotColor: 'bg-gray-500',
            borderColor: 'border-gray-200',
            text: 'INACTIVE'
          };
        case 'deleted':
          return {
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            dotColor: 'bg-red-500',
            borderColor: 'border-red-200',
            text: 'DELETED'
          };
        default:
          return {
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-700',
            dotColor: 'bg-gray-500',
            borderColor: 'border-gray-200',
            text: 'UNKNOWN'
          };
      }
    };
  
    const config = getStatusConfig(status);
  
    return (
      <Badge className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
        <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
        {config.text}
      </Badge>
    );
  };
  
  // Customer logo component
 export const CustomerLogo = ({ logo, name }: { logo: string; name: string }) => {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center text-white text-xs font-bold">
          {logo}
        </div>
        <span className="font-medium">{name}</span>
      </div>
    );
  };
  
  // Actions component
export const ActionsCell = ({ setCurrentDialog, row }: { setCurrentDialog: (dialog: DialogType, customerId: string) => void, row: Row<Customer> }) => {
    return (
      <div className="flex items-center gap-2 justify-end w-full">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentDialog(DialogType.EDIT_CUSTOMER, row.original.id)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Customer</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={() => setCurrentDialog(DialogType.DELETE_CUSTOMER, row.original.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="bg-white hover:bg-gray-50 text-primary-500 border border-primary-300 rounded-sm">
            Manage
            <div className="ml-2 flex items-center justify-center w-4 h-4 rounded-full border border-primary-600">
              <ChevronRight className="h-2.5 w-2.5 text-primary-600" />
            </div>
          </Button>
        </div>
      </div>
    );
  };
  
  // Summary Card Component
export const SummaryCard = ({ title, value, className = "" }: { title: string; value: string; className?: string }) => {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <p className="text-sm text-typography-500 mb-2">{title}</p>
        <p className="text-2xl font-bold text-typography-900">{value}</p>
      </div>
    );
  };
  
  // Filter Tag Component
export const FilterTag = ({ label, onRemove }: { label: string; onRemove: () => void }) => {
    return (
      <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
        <span>{label}</span>
        <button 
          type="button"
          onClick={onRemove} 
          className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  };