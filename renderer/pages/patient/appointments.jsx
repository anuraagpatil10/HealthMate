'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, MoreVertical, Plus, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { format } from 'date-fns'
import Sidebar from "@/components/patient/Sidebar" // Adjust the import path based on your file structure
import Header from "@/components/patient/Header" // Adjust the import path based on your file structure

export default function PatientAppointmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Sarah Wilson", specialty: "Cardiologist", date: "2023-06-15", time: "10:00 AM", location: "Heart Health Clinic" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "General Physician", date: "2023-06-18", time: "2:30 PM", location: "City Medical Center" },
    { id: 3, doctor: "Dr. Emily Johnson", specialty: "Dermatologist", date: "2023-06-20", time: "11:15 AM", location: "Skin Care Institute" },
    { id: 4, doctor: "Dr. David Lee", specialty: "Orthopedic Surgeon", date: "2023-06-22", time: "9:00 AM", location: "Bone & Joint Center" },
    { id: 5, doctor: "Dr. Lisa Chen", specialty: "Gynecologist", date: "2023-06-25", time: "3:45 PM", location: "Women's Health Clinic" },
  ])

  const filteredAppointments = appointments.filter(appointment => 
    appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const bookAppointment = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newAppointment = {
      id: appointments.length + 1,
      doctor: formData.get('doctor'),
      specialty: formData.get('specialty'),
      date: format(new Date(formData.get('date')), 'yyyy-MM-dd'),
      time: formData.get('time'),
      location: formData.get('location')
    }
    setAppointments([...appointments, newAppointment])
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <main className="p-6">
            <div className="container mx-auto p-6 bg-[#F0F4F8]">
              <h1 className="text-3xl font-bold text-[#1A365D] mb-6">My Appointments</h1>
              
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search appointments..."
                    className="pl-8 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[--first] hover:bg-[--second] text-white">
                      <Plus className="mr-2 h-4 w-4" /> Book New Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={bookAppointment}>
                      <DialogHeader>
                        <DialogTitle>Book New Appointment</DialogTitle>
                        <DialogDescription>
                          Enter the details for your new appointment. Click book when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="doctor" className="text-right">
                            Doctor
                          </Label>
                          <Input id="doctor" name="doctor" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="specialty" className="text-right">
                            Specialty
                          </Label>
                          <Input id="specialty" name="specialty" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">
                            Date
                          </Label>
                          <Input id="date" name="date" className="col-span-3" type="date" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="time" className="text-right">
                            Time
                          </Label>
                          <Input id="time" name="time" className="col-span-3" type="time" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="location" className="text-right">
                            Location
                          </Label>
                          <Input id="location" name="location" className="col-span-3" required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-[--first] hover:bg-[--second] text-white">Book Appointment</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>View and manage your scheduled appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    {filteredAppointments.map((appointment) => (
                      <div key={appointment.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={`/placeholder.svg?${appointment.id}`} alt={appointment.doctor} />
                              <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-[#2D3748]">{appointment.doctor}</h3>
                              <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Reschedule</DropdownMenuItem>
                              <DropdownMenuItem>Cancel Appointment</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-500">
                            <Calendar className="mr-2 h-4 w-4" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="mr-2 h-4 w-4" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center text-gray-500 col-span-2">
                            <MapPin className="mr-2 h-4 w-4" />
                            {appointment.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}
