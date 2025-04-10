'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
import { format } from 'date-fns'
import Sidebar from "@/components/patient/Sidebar" // Adjust the import path based on your file structure
import Header from "@/components/patient/Header" // Adjust the import path based on your file structure

export default function PatientAppointmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchAppointments = async () => {
      const cookies = await window.healthMateAPI.getCookies();
      const accessToken = cookies.find(cookie => cookie.name === 'healthMateSession');
      const userSession = JSON.parse(accessToken.value);
      const patientId = userSession.user.id;
      const response = await window.healthMateAPI.getPatientAppointments(patientId);
      
      if (response.error) {
        console.error(response.error)
      } else {
        setAppointments(response.data)
      }
    }

    const fetchDoctors = async () => {
      const response = await window.healthMateAPI.getDoctors()
      if (response.error) {
        console.error(response.error)
      } else {
        setDoctors(response.data)
      }
    }
    
    fetchAppointments()
    fetchDoctors()
  }, [])
  
  const nextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))
  }
  
  const previousDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))
  }
  
  const filteredAppointments = appointments.filter(appointment => 
    appointment.date === format(currentDate, 'yyyy-MM-dd')
  )
  
  const handleSaveAppointment = async (event) => {
    event.preventDefault()
    const cookies = await window.healthMateAPI.getCookies();
    const accessToken = cookies.find(cookie => cookie.name === 'healthMateSession');
    const userSession = JSON.parse(accessToken.value);
    const patientId = userSession.user.id;
    const formData = new FormData(event.target)
    const newAppointment = {
      doctor_id: formData.get('doctor_id'),
      patient_id: patientId,
      date: formData.get('date'),
      time: formData.get('time'),
      type: formData.get('type'),
      reason: formData.get('reason'), // Added reason
      status: 'Pending' // Default status
    }
    newAppointment.date = format(new Date(newAppointment.date), 'yyyy-MM-dd')
    const response = await window.healthMateAPI.saveAppointment(newAppointment)
    if (response.error) {
      console.error(response.error)
      return;
    }
    router.reload() // Reload the current page
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

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
                    <Button className="bg-[--second] hover:bg-[--first]">
                      <Plus className="mr-2 h-4 w-4" /> New Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSaveAppointment}>
                      <DialogHeader>
                        <DialogTitle>New Appointment</DialogTitle>
                        <DialogDescription>
                          Fill in the details for the new appointment. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="doctor_id" className="text-right">
                            Doctor
                          </Label>
                          <Select id="doctor_id" name="doctor_id" required>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  {doctor.name} - {doctor.specialty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">
                            Date
                          </Label>
                          <Input id="date" name="date" type="date" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="time" className="text-right">
                            Time
                          </Label>
                          <Input id="time" name="time" type="time" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="type" className="text-right">
                            Type
                          </Label>
                          <Select name="type">
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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="reason" className="text-right">
                            Reason
                          </Label>
                          <Input id="reason" name="reason" type="text" className="col-span-3" required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="bg-[--second] hover:bg-[--first]" type="submit">Save appointment</Button>
                      </DialogFooter>
                    </form>
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
                        <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{appointment.doctor}</p>
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
