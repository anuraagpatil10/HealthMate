'use client'

import { useState } from 'react'
import { Bell, Calendar, ChevronDown, FileText, Home, Menu, MessageSquare, Search, Settings, Users, X, Filter, Check, AlertCircle, Clock, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/patient/Header" // Adjust the import path based on your file structure
import Sidebar from "@/components/patient/Sidebar" // Adjust the import path based on your file structure

export default function DoctorNotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'appointment', title: 'Upcoming Appointment', description: 'With John Doe at 2:00 PM', time: '30 minutes ago', read: false },
    { id: 2, type: 'message', title: 'New Message', description: 'From Dr. Emily Johnson', time: '1 hour ago', read: false },
    { id: 3, type: 'lab', title: 'Lab Results Ready', description: 'CBC for patient Sarah Smith', time: '2 hours ago', read: false },
    { id: 4, type: 'system', title: 'System Update', description: 'New features available in the portal', time: 'Yesterday', read: true },
    { id: 5, type: 'appointment', title: 'Appointment Rescheduled', description: 'Mike Johnson moved to 4:30 PM', time: 'Yesterday', read: true },
    { id: 6, type: 'lab', title: 'Urgent Lab Results', description: 'Abnormal findings for patient Alex Wilson', time: '2 days ago', read: true },
  ])
  const [filter, setFilter] = useState('all')

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || (filter === 'unread' && !notif.read) || notif.type === filter
  )

  const getIcon = (type) => {
    switch(type) {
      case 'appointment': return <CalendarIcon className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'lab': return <FileText className="h-4 w-4" />;
      case 'system': return <AlertCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="p-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Notifications</CardTitle>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter notifications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="appointment">Appointments</SelectItem>
                    <SelectItem value="message">Messages</SelectItem>
                    <SelectItem value="lab">Lab Results</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>You have {notifications.filter(n => !n.read).length} unread notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-250px)]">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`mb-4 p-4 rounded-lg ${notification.read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50 transition-colors duration-200`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`rounded-full p-2 ${
                          notification.type === 'appointment' ? 'bg-purple-100 text-purple-600' :
                          notification.type === 'message' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'lab' ? 'bg-green-100 text-green-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {getIcon(notification.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{notification.title}</h3>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
