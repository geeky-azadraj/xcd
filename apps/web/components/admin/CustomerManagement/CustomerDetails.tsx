import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockCustomerData } from "../../../app/admin/(main)/(customer-management)/customer-details/[id]/page";
import { CustomSwitch } from "@/components/ui/CustomSwitch";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin, MoreVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddEditCustomer } from "./AddEditCustomer";
import { useState } from "react";

// Customer Overview Card Component
export const CustomerOverviewCard = ({ 
    customer, 
    isEnabled, 
    onEnableToggle 
  }: { 
    customer: typeof mockCustomerData;
    isEnabled: boolean;
    onEnableToggle: (checked: boolean) => void;
  }) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Top Section with Logo, Name, and Enable Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-sm">
              <AvatarImage className="rounded-none" src={customer.imageUrl} alt={customer.name} />
              <AvatarFallback className="bg-blue-600 text-white font-bold text-lg w-full h-full rounded-none">
                {customer.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Enable</span>
            <CustomSwitch 
              checked={isEnabled} 
              onCheckedChange={onEnableToggle}
            />
          </div>
        </div>
        
        {/* Dashed Divider */}
        <div className="border-t border-dashed border-gray-300 mb-6"></div>
        
        {/* Bottom Section - Details */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {customer.status}
              </Badge>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">No. of Events</p>
            <p className="text-xl font-bold text-gray-900">{customer.numberOfEvents.toString().padStart(2, '0')}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Location</p>
            <p className="text-xl font-bold text-gray-900">{customer.location}</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Primary Contact Card Component
export const PrimaryContactCard = ({ contact }: { contact: typeof mockCustomerData.primaryContact }) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm relative py-6">
        <div className="absolute top-0 left-0 right-0 h-4 border-t-4 border-primary-500 rounded-t-2xl"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 px-6">Primary Contact Details</h3>
        
        <div className="border-t border-gray-300 mb-4"></div>
        
        {/* Name and Location Section */}
        <div className="flex items-center justify-between mb-4 px-6">
          <h4 className="text-lg font-semibold text-gray-900">{contact.name}</h4>
          <div className="flex items-center gap-1 bg-primary-0 text-primary-600 px-3 py-1 rounded-full">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{contact.location}</span>
          </div>
        </div>
        
        <div className="border-t border-dashed border-gray-300 mb-4 mx-6"></div>
        
        {/* Contact Details - Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 px-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="text-gray-900 font-medium">{contact.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Phone No.</p>
            <p className="text-gray-900 font-medium">{contact.phone}</p>
          </div>
        </div>
      </div>
    );
};

export const CustomerDetailsHeader = ({ customerId }: { customerId?: string }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEditClick = () => {
        setIsEditDialogOpen(true);
    };

    return (
      <>
        <div className="bg-white mb-6 p-6">
          {/* Breadcrumbs */}
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Link href="/admin/customer-management/customer-list" className="hover:text-primary-600 font-bold cursor-pointer">Customer management</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="text-gray-600">Customer details</span>
          </div>
          
          {/* Page Title and Actions */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Customer details</h1>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="default"
                className="flex items-center gap-2 px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleEditClick}
              >
                <Pencil className="h-4 w-4" />
                Edit Details
              </Button>
              
              <Button 
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 px-4 py-2"
              >
                Manage
                <div className="w-5 h-5 border border-white rounded-full flex items-center justify-center">
                  <ChevronRight className="h-3 w-3 text-white" />
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="w-10 h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* AddEditCustomer Dialog */}
        <AddEditCustomer
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          type="edit"
          customerId={customerId}
        />
      </>
    );
  };