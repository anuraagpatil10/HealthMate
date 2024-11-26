'use client'

import { useState } from 'react'
import { Search, Filter, Star, MapPin, Calendar, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from "@/components/patient/Header" // Adjust the import path based on your file structure
import Sidebar from "@/components/patient/Sidebar" // Adjust the import path based on your file structure

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const doctors = [
    { id: 1, name: "Dr. Sarah Wilson", specialty: "Cardiologist", rating: 4.8, location: "Heart Health Clinic, Mumbai", availableSlot: "Tomorrow, 10:00 AM" },
    { id: 2, name: "Dr. Michael Chen", specialty: "General Physician", rating: 4.6, location: "City Medical Center, Delhi", availableSlot: "Today, 2:30 PM" },
    { id: 3, name: "Dr. Emily Johnson", specialty: "Dermatologist", rating: 4.9, location: "Skin Care Institute, Bangalore", availableSlot: "Friday, 11:15 AM" },
    { id: 4, name: "Dr. David Lee", specialty: "Orthopedic Surgeon", rating: 4.7, location: "Bone & Joint Center, Hyderabad", availableSlot: "Next Monday, 9:00 AM" },
    { id: 5, name: "Dr. Lisa Chen", specialty: "Gynecologist", rating: 4.8, location: "Women's Health Clinic, Chennai", availableSlot: "Wednesday, 3:45 PM" },
  ]

  const filteredDoctors = doctors.filter(doctor => 
    (doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (specialtyFilter === 'all' || doctor.specialty === specialtyFilter)
  )

  const bookAppointment = (doctorId, slot) => {
    // In a real application, this would trigger an API call to book the appointment
    toast.success("Appointment Booked", {
      description: `Your appointment with Doctor #${doctorId} for ${slot} has been booked successfully.`,
    })
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <main className="p-6">
            <ToastContainer />
            <h1 className="text-3xl font-bold text-[#1A365D] mb-6">Find a Doctor</h1>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search doctors..."
                  className="pl-8 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white">
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="General Physician">General Physician</SelectItem>
                  <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="Orthopedic Surgeon">Orthopedic Surgeon</SelectItem>
                  <SelectItem value="Gynecologist">Gynecologist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Available Doctors</CardTitle>
                <CardDescription>Find and book appointments with top doctors</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`/placeholder.svg?${doctor.id}`} alt={doctor.name} />
                            <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-[#2D3748]">{doctor.name}</h3>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm text-gray-600">{doctor.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white">
                              Book Appointment
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                              <DialogDescription>
                                Confirm your appointment details below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input id="name" defaultValue="John Doe" className="col-span-3" />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="slot" className="text-right">
                                  Slot
                                </Label>
                                <Input id="slot" defaultValue={doctor.availableSlot} className="col-span-3" readOnly />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={() => bookAppointment(doctor.id, doctor.availableSlot)} className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white">
                                Confirm Booking
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        <div className="flex items-center mt-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          {doctor.location}
                        </div>
                        <div className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <Clock className="h-4 w-4 mr-2" />
                          Next Available: {doctor.availableSlot}
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}
