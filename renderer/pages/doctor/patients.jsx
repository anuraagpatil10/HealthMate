'use client'

import { useState } from 'react'
import { Users, Search, Plus, UserPlus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import Sidebar from '../../components/doctor/Sidebar'
import Header from '../../components/doctor/Header'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PatientsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  })

  const handleNewPatientChange = (e     ) => {
    const { name, value } = e.target
    setNewPatient(prev => ({ ...prev, [name]: value }))
  }

  const handleNewPatientSubmit = (e) => {
    e.preventDefault()
    console.log('New patient submitted:', newPatient)
    // Here you would typically send this data to your backend
    setIsNewPatientOpen(false)
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    })
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <main className="p-6">
            <div className="grid gap-6">
              {/* Header Card */}
              <Card className="bg-gradient-to-r from-[--first] to-[--second] text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Patients</CardTitle>
                  <p className="text-blue-100">Manage your patient records and information</p>
                </CardHeader>
                <CardContent>
                  <Dialog open={isNewPatientOpen} onOpenChange={setIsNewPatientOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-gray-800 hover:bg-gray-100">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New Patient
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Patient</DialogTitle>
                        <DialogDescription>
                          Enter the details of the new patient. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleNewPatientSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={newPatient.name}
                              onChange={handleNewPatientChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={newPatient.email}
                              onChange={handleNewPatientChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                              Phone
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={newPatient.phone}
                              onChange={handleNewPatientChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dateOfBirth" className="text-right">
                              Date of Birth
                            </Label>
                            <Input
                              id="dateOfBirth"
                              name="dateOfBirth"
                              type="date"
                              value={newPatient.dateOfBirth}
                              onChange={handleNewPatientChange}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save Patient</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Filters and Search */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search patients..."
                    className="pl-8"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Patients</SelectItem>
                    <SelectItem value="recent">Recent Patients</SelectItem>
                    <SelectItem value="upcoming">Upcoming Appointments</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="name-az">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-az">Name A-Z</SelectItem>
                    <SelectItem value="name-za">Name Z-A</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Patients List */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patients.map((patient, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={patient.avatar} alt={patient.name} />
                            <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-gray-500">{patient.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-gray-500">Last Visit: {patient.lastVisit}</span>
                          <span className="text-sm text-gray-500">|</span>
                          <span className="text-sm text-gray-500">Next Appointment: {patient.nextAppointment}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            Schedule Appointment
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}

const patients = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "Nov 15, 2023",
    nextAppointment: "Dec 5, 2023"
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "Nov 20, 2023",
    nextAppointment: "Dec 10, 2023"
  },
  {
    name: "Carol Williams",
    email: "carol.williams@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "Nov 25, 2023",
    nextAppointment: "Dec 15, 2023"
  },
  {
    name: "David Brown",
    email: "david.brown@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "Nov 30, 2023",
    nextAppointment: "Dec 20, 2023"
  },
  {
    name: "Eva Davis",
    email: "eva.davis@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastVisit: "Dec 1, 2023",
    nextAppointment: "Dec 25, 2023"
  }
]

