'use client'

import React, { use } from 'react'
import { useRouter } from "next/router"
import Link from "next/link"
import { Home, Calendar, FileText, Users, MessageSquare, Settings, LogOut, Pill, Activity, Target , X} from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo"

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const { pathname } = router
  
  const handleLogout = async () => {
    try {
      const response = await window.supabaseAPI.logout();
      if (response.success) {
        router.push('/login');
      } else {
        console.error('Logout failed:', response.error);
      }
    } catch (error) {
      console.error('An unexpected error occurred during logout:', error);
    }
  };

  // Function to check if a path is active
  const isActive = (path) => {
    return pathname === path
  }

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[--second] p-6 shadow-lg transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center justify-between">
          <Logo logoSize="text-2xl" imgSize={30} />
        </div>
        <nav className="space-y-2 flex flex-col gap-1">
          {[
            { icon: Home, label: 'Dashboard', path: '/patient/dashboard' },
            { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
            { icon: FileText, label: 'Prescriptions', path: '/patient/prescriptions' },
            { icon: Users, label: 'Doctors', path: '/patient/doctors' },
            { icon: MessageSquare, label: 'Messages' , path: '/patient/messages' },
            { icon: Activity, label: 'Lab Results' , path: '/patient/lab-results' },
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
            className="w-full justify-start bg-[--second] hover:bg-white hover:text-[--first]"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </nav>
      </aside>
      {sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className={`fixed top-6 left-72 z-50 bg-[--second] hover:bg-[--second] lg:hidden transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      )}
    </>
  )
}