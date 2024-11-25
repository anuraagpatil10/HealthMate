'use client'

import { useState } from 'react'
import { Bell, Calendar, ChevronLeft, ChevronRight, Clock, Filter, Menu, MoreVertical, Plus, Search, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Header from "@/components/doctor/Header" 
import Sidebar from "@/components/doctor/Sidebar"
import { format } from 'date-fns'

export default function DoctorAppointmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  const appointments = [
    { id: 1, patient: "John Doe", time: "09:00 AM", type: "Check-up", status: "Confirmed", date: "2024-11-26" },
    { id: 2, patient: "Jane Smith", time: "10:30 AM", type: "Follow-up", status: "Confirmed", date: "2024-11-26" },
    { id: 3, patient: "Mike Johnson", time: "11:45 AM", type: "Consultation", status: "Pending", date: "2024-11-25" },
    { id: 4, patient: "Emily Brown", time: "02:00 PM", type: "Check-up", status: "Confirmed", date: "2024-11-26" },
    { id: 5, patient: "Alex Wilson", time: "03:30 PM", type: "Follow-up", status: "Cancelled", date: "2024-11-26" },
    { id: 6, patient: "Sarah Davis", time: "04:45 PM", type: "Consultation", status: "Confirmed", date: "2024-11-26" },
  ]

  const nextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))
  }

  const previousDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))
  }

  const filteredAppointments = appointments.filter(appointment => 
    appointment.date === format(currentDate, 'yyyy-MM-dd')
  )

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Appointments Content */}
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <main className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={previousDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <Button variant="outline" size="icon" onClick={nextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Appointments</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> New Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>New Appointment</DialogTitle>
                      <DialogDescription>
                        Fill in the details for the new appointment. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="patient" className="text-right">
                          Patient
                        </Label>
                        <Input id="patient" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date
                        </Label>
                        <Input id="date" type="date" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Time
                        </Label>
                        <Input id="time" type="time" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select appointment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="check-up">Check-up</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save appointment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-6">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {appointment.time}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Cancel Appointment</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{appointment.patient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                      <Button variant="outline" size="sm">Start Session</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}
