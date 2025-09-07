"use client"
import { ChevronDown, Settings, LogOut, UserCircle2, ChevronUp } from "lucide-react"

import Image from "next/image"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { mockUser } from "@/app/admin/(main)/(event-management)/[userId]/my-events/data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LogoutModal from "./LogoutModal"

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  //Handle logout button click

  const handleLogout = () => {
    setShowLogoutModal(true);
    setIsOpen(false);
  }

  const confirmLogout = () => {
    setIsLoggingOut(true);
    //simulating the logout process
    setTimeout(() => {
        setIsLoggingOut(false);
        setShowLogoutModal(false);
        alert("Logout");
    },3000)

  }

  //handle logout cancle

  const cancleLogout = () => {
    setShowLogoutModal(false);
    setIsLoggingOut(false);
  }

  return (
    //Logo:

    <header className="flex h-16 items-center justify-between border-b bg-[#FFFFFF] px-6">
      <div className="flex">
        <Image
          src="/xcd-logo.svg"
          alt="xcd-logo"
          width={40}
          height={40}
          className="rounded-lg shadow-blue-300 ring-4 ring-blue-100 drop-shadow-lg "
        />
        <div className="pl-3">
          <p className=" text-lg font-bold  tracking-wide ">X-CD</p>
          <p className=" text-xs  tracking-widest text-gray-500 ">ADMIN</p>
        </div>
      </div>

      {/** User profile dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className=" flex items-center  gap-3  px-3 py-2 focus-visible:bg-inherit focus-visible:ring-0 data-[state=open]:ring-1 data-[state=open]:ring-gray-300 data-[state=open]:ring-offset-1"
          >
            <Settings className="h-5 w-5 text-gray-600 " />
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/** User avtar with fallback */}
          <div className="flex h-[70px] w-[270px] items-center gap-2  ">
            <div className="ml-4 flex   items-center">
              {!imageError && mockUser.imgUrl ? (
                <Image
                  src={mockUser.imgUrl}
                  alt={mockUser.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <UserCircle2 className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">{mockUser.name}</p>
              <p className="text-xs text-gray-500 ">{mockUser.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              variant="ghost"
              className=" w-full cursor-pointer justify-start p-4 text-red-600 hover:border-none hover:bg-gray-200/40 hover:text-black "
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-[16px] w-[16px] text-red-600 hover:border-none hover:bg-inherit hover:text-red-600" />
              <span className="">Logout</span>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {/** Logout Modal */}
      <LogoutModal 
      isOpen={showLogoutModal}
      onClose={cancleLogout}
      onConfirm={confirmLogout}
      isLoading={isLoggingOut}
      />
    </header>
  )
}

export default AdminHeader
