'use client'

import React, { use } from 'react'
import { useRouter } from "next/router"
import Link from "next/link"
import {
  Home,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo"

export default function Sidebar({ sidebarOpen, setSidebarOpen, handleLogout }) {
  const router = useRouter();
  const { pathname } = router
  
  // Function to check if a path is active
  const isActive = (path) => {
    return pathname === path
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[--second] p-6 shadow-lg transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-8 flex items-center justify-between">
        <Logo logoSize="text-2xl" imgSize={30} />
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <nav className="space-y-2 flex flex-col gap-1">
        {[
          { icon: Home, label: 'Dashboard', path: '/app/dashboard' },
          { icon: Calendar, label: 'Appointments', path: '/app/appointments' },
          { icon: FileText, label: 'Prescriptions', path: '/app/prescriptions' },
          { icon: Users, label: 'Doctors', path: '/app/doctors' },
          { icon: MessageSquare, label: 'Messages', path: '/app/messages' },
          { icon: Settings, label: 'Settings', path: '/app/settings' },
        ].map((item, index) => (
          <Link key={index} href={item.path}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive(item.path) ? "text-[--primary] bg-white" : "bg-[--second] hover:bg-white hover:text-[--first]"}`}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
        <Button
          variant="ghost"
          className="w-full justify-start text-[--first] hover:bg-[--second] hover:text-[--first]"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </nav>
    </aside>
  )
}