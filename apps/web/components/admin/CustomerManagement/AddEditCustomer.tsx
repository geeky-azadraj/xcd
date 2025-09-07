"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronDownIcon, CheckIcon, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Country code to flag mapping
const countryCodeToFlag: Record<string, string> = {
    "+1": "🇺🇸",
    "+44": "🇬🇧", 
    "+234": "🇳🇬",
    "+91": "🇮🇳"
}

// Zod schema for form validation
const addCustomerFormSchema = z.object({
    selectedCustomer: z.string().min(1, "Please select a customer"),
    repName: z.string().min(1, "Representative name is required"),
    location: z.string().min(1, "Location is required"),
    email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    countryCode: z.string().min(1, "Country code is required")
})

const editCustomerFormSchema = z.object({
    repName: z.string().min(1, "Representative name is required"),
    location: z.string().min(1, "Location is required"),
    email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    countryCode: z.string().min(1, "Country code is required")
})

type AddCustomerFormData = z.infer<typeof addCustomerFormSchema>
type EditCustomerFormData = z.infer<typeof editCustomerFormSchema>
type CustomerFormData = AddCustomerFormData | EditCustomerFormData

interface Customer {
    id: string
    name: string
}

interface AddEditCustomerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    type?: "add" | "edit"
    customerId?: string | null
}

export function AddEditCustomer({ open, onOpenChange, type = "edit", customerId }: AddEditCustomerProps) {
    const [step, setStep] = React.useState(0)
    const [selectedCustomer, setSelectedCustomer] = React.useState("")

    // Mock customer data for edit mode
    const mockCustomerData = React.useMemo(() => {
        if (!customerId || type !== "edit") return null
        
        // Mock data based on customer ID
        const mockData = {
            "1": {
                repName: "John Smith",
                location: "New York, USA",
                email: "john.smith@tedx.com",
                phoneNumber: "1234567890",
                countryCode: "+1"
            },
            "2": {
                repName: "Sarah Johnson",
                location: "London, UK",
                email: "sarah.johnson@spotify.com",
                phoneNumber: "9876543210",
                countryCode: "+44"
            },
            "3": {
                repName: "Mike Chen",
                location: "Los Angeles, USA",
                email: "mike.chen@netflix.com",
                phoneNumber: "5551234567",
                countryCode: "+1"
            },
            "4": {
                repName: "Emma Wilson",
                location: "San Francisco, USA",
                email: "emma.wilson@visa.com",
                phoneNumber: "4445556666",
                countryCode: "+1"
            },
            "5": {
                repName: "David Brown",
                location: "Seattle, USA",
                email: "david.brown@microsoft.com",
                phoneNumber: "7778889999",
                countryCode: "+1"
            }
        }
        
        return mockData[customerId as keyof typeof mockData] || {
            repName: "Default Rep",
            location: "Default Location",
            email: "default@example.com",
            phoneNumber: "0000000000",
            countryCode: "+234"
        }
    }, [customerId, type])

    const form = useForm<CustomerFormData>({
        resolver: zodResolver(type === "add" ? addCustomerFormSchema : editCustomerFormSchema),
        defaultValues: {
            ...(type === "add" && { selectedCustomer: "" }),
            repName: mockCustomerData?.repName || "",
            location: mockCustomerData?.location || "",
            email: mockCustomerData?.email || "",
            phoneNumber: mockCustomerData?.phoneNumber || "",
            countryCode: mockCustomerData?.countryCode || "+234"
        }
    })

    // Reset form when customerId changes
    React.useEffect(() => {
        if (customerId && type === "edit") {
            form.reset({
                repName: mockCustomerData?.repName || "",
                location: mockCustomerData?.location || "",
                email: mockCustomerData?.email || "",
                phoneNumber: mockCustomerData?.phoneNumber || "",
                countryCode: mockCustomerData?.countryCode || "+234"
            })
        } else if (type === "add") {
            form.reset({
                selectedCustomer: "",
                repName: "",
                location: "",
                email: "",
                phoneNumber: "",
                countryCode: "+234"
            })
        }
    }, [customerId, type, mockCustomerData, form])

    // Mock customer data
    const customers: Customer[] = [
        { id: "1", name: "UNESCO" },
        { id: "2", name: "TEDX DESIGN EVENT" },
        { id: "3", name: "TEDX EVENT TALK" }
    ]
    const onSubmit = async (data: CustomerFormData) => {
        try {
            // Here you would typically send the data to your API
            console.log("Form data:", data)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            setStep(1) // Move to success step
        } catch (error) {
            console.error("Error submitting form:", error)
        }
    }

    const handleClose = () => {
        setStep(0)
        setSelectedCustomer("")
        form.reset({
            ...(type === "add" && { selectedCustomer: "" }),
            repName: mockCustomerData?.repName || "",
            location: mockCustomerData?.location || "",
            email: mockCustomerData?.email || "",
            phoneNumber: mockCustomerData?.phoneNumber || "",
            countryCode: mockCustomerData?.countryCode || "+234"
        })
        onOpenChange(false)
    }

    const renderStep0 = () => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Select Customer Section - Only show in add mode */}
                {type === "add" && (
                    <>
                        <FormField
                            control={form.control}
                            name="selectedCustomer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Customer</FormLabel>
                                    <FormControl>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {field.value || "Select customer"}
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]">
                                                {customers.map((customer) => (
                                                    <DropdownMenuItem
                                                        key={customer.id}
                                                        onClick={() => {
                                                            field.onChange(customer.name)
                                                            setSelectedCustomer(customer.name)
                                                        }}
                                                        className="cursor-pointer focus:ring-0 focus:ring-offset-0 focus:outline-none hover:bg-primary-100"
                                                    >
                                                        {customer.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Dashed Separator */}
                        <div className="border-t border-dashed border-gray-300"></div>
                    </>
                )}

                {/* Primary Contact Details Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Primary Contact Details</h3>

                    <FormField
                        control={form.control}
                        name="repName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rep. Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter location" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address*</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ph. number</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="w-24 justify-between">
                                                        <span className="flex items-center gap-1">
                                                            <span className="text-sm">{countryCodeToFlag[form.watch("countryCode")] || "🇺🇸"}</span>
                                                            {form.watch("countryCode")}
                                                        </span>
                                                        <ChevronDownIcon className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => form.setValue("countryCode", "+1")}>
                                                        🇺🇸 +1
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => form.setValue("countryCode", "+44")}>
                                                        🇬🇧 +44
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => form.setValue("countryCode", "+234")}>
                                                        🇳🇬 +234
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => form.setValue("countryCode", "+91")}>
                                                        🇮🇳 +91
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Input placeholder="0000 000 0000" className="flex-1" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting} className="relative bg-blue-600 hover:bg-blue-700">
                        {form.formState.isSubmitting 
                            ? (type === "edit" ? "Updating..." : "Sending...") 
                            : (type === "edit" ? "Save Changes" : "Send Invite")
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )

    const renderStep1 = () => (
        <div className="space-y-6 text-left">
            {/* Success Icon and Close Button Row */}
            <div className="flex justify-between items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-500">
                    <CheckIcon className="h-6 w-6 text-white" />
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-6 w-6 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            
            {/* Success Message */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                    {type === "edit" ? "Customer Details Updated Successfully" : "Customer Added Successfully"}
                </h3>
                {type === "add" && ( <p className="text-sm text-gray-600">
                    The customer has been added to your list. You can now view or edit their details.
                </p>)}
            </div>
            
            {/* Action Button */}
            <div className="pt-4">
                <Button 
                    onClick={handleClose} 
                    variant="outline"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                >
                    Done
                </Button>
            </div>
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className={step === 0 ? "min-w-[50vw] max-w-2xl" : "min-w-[400px] max-w-md"}>
                {step === 0 && (
                    <DialogHeader className="relative">
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            {type === "edit" ? "Edit Customer Details" : "Add Customer"}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="absolute right-0 top-0 h-6 w-6 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogHeader>
                )}
                {step === 0 ? renderStep0() : renderStep1()}
            </DialogContent>
        </Dialog>
    )
}
