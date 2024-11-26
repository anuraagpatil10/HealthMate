'use client'

import React, { useState } from 'react'
import { Bell, Menu, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import Sidebar from "@/components/patient/Sidebar"
import { Home, Calendar, FileText, Users, MessageSquare, Settings, LogOut, X } from 'lucide-react'
import { useRouter } from 'next/navigation'; 
import Header from "@/components/patient/Header"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Dashboard Content */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <main className="p-6">
            <div className="grid gap-6">
              {/* Welcome Card */}
              <Card className="bg-gradient-to-r from-[--first] to-[--second] text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome back, John!</CardTitle>
                  <CardDescription className="text-blue-100">Here's an overview of your health journey.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-200">Next Appointment</p>
                      <p className="text-lg font-semibold">Tomorrow, 10:00 AM</p>
                      <p className="text-sm text-blue-200">with Dr. Sarah Wilson</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-200">Medication Adherence</p>
                      <Progress value={80} className="mt-2 bg-blue-300" />
                      <p className="mt-1 text-sm text-blue-200">80% - Great job!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
                {[
                  { title: "Book Appointment", description: "Schedule a consultation", action: "Book Now", color: "bg-[--first]" },
                  { title: "Upcoming Appointments", description: "View scheduled visits", action: "View All", color: "bg-[--second]" },
                  { title: "Active Prescriptions", description: "Track your medications", action: "Manage", color: "bg-[--first]" },
                ].map((item, index) => (
                  <Card key={index} className={`${item.color} text-white`}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription className="text-white/80">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="secondary" className="w-full bg-white text-gray-800 hover:bg-gray-100">
                        {item.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Dashboard Tabs */}
              <Tabs defaultValue="appointments" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 bg-muted p-1 rounded-lg">
                  {["Appointments", "Prescriptions", "Find Doctors", "Health Records"].map((tab) => (
                    <TabsTrigger key={tab} value={tab.toLowerCase().replace(' ', '-')} className="rounded-md data-[state=active]:bg-white">
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="appointments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { doctor: "Dr. Sarah Wilson", specialty: "Cardiologist", date: "Tomorrow at 10:00 AM" },
                          { doctor: "Dr. Michael Chen", specialty: "General Physician", date: "Friday at 2:30 PM" },
                          { doctor: "Dr. Emily Johnson", specialty: "Dermatologist", date: "Next Monday at 11:15 AM" }
                        ].map((appointment, index) => (
                          <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-4">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{appointment.doctor}</h3>
                                <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                <p className="text-sm text-gray-500">{appointment.date}</p>
                              </div>
                            </div>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button variant="ghost" size="sm">Cancel</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="prescriptions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Prescriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Amoxicillin", dosage: "500mg - 3 times daily", remaining: "5 days remaining" },
                          { name: "Lisinopril", dosage: "10mg - Once daily", remaining: "Ongoing" },
                          { name: "Metformin", dosage: "1000mg - Twice daily", remaining: "Refill needed" }
                        ].map((medication, index) => (
                          <div key={index} className="rounded-lg bg-muted p-4">
                            <h3 className="font-semibold">{medication.name}</h3>
                            <p className="text-sm text-gray-500">{medication.dosage}</p>
                            <p className="text-sm text-gray-500">{medication.remaining}</p>
                            <div className="mt-2 space-x-2">
                              <Button variant="outline" size="sm">Set Reminder</Button>
                              <Button variant="ghost" size="sm">Refill Request</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="find-doctors" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Find Doctors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          { name: "Dr. Emily Johnson", specialty: "Neurologist", experience: "15 years", availability: "Available today" },
                          { name: "Dr. David Lee", specialty: "Dermatologist", experience: "10 years", availability: "Next available: Tomorrow" },
                          { name: "Dr. Maria Rodriguez", specialty: "Pediatrician", experience: "12 years", availability: "Available this week" },
                          { name: "Dr. James Smith", specialty: "Orthopedic Surgeon", experience: "20 years", availability: "Limited availability" },
                          { name: "Dr. Lisa Chen", specialty: "Gynecologist", experience: "8 years", availability: "Available next week" },
                          { name: "Dr. Robert Brown", specialty: "Psychiatrist", experience: "18 years", availability: "Online consultations available" }
                        ].map((doctor, index) => (
                          <div key={index} className="rounded-lg bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`/placeholder.svg?${index}`} alt={doctor.name} />
                                <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{doctor.name}</h3>
                                <p className="text-sm text-gray-500">{doctor.specialty}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">{doctor.experience} experience</p>
                            <p className="text-sm text-gray-500">{doctor.availability}</p>
                            <div className="mt-3">
                              <Button className="w-full bg-[--first] hover:bg-[--second]">
                                Book Appointment
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="health-records" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Health Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { title: "Blood Test Results", date: "Last updated: 2 weeks ago", icon: FileText },
                          { title: "Vaccination History", date: "Last updated: 3 months ago", icon: FileText },
                          { title: "Allergy Information", date: "Last updated: 6 months ago", icon: FileText },
                          { title: "Medical History", date: "Last updated: 1 year ago", icon: FileText }
                        ].map((record, index) => (
                          <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-[--first] p-2 text-white">
                                <record.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{record.title}</h3>
                                <p className="text-sm text-gray-500">{record.date}</p>
                              </div>
                            </div>
                            <Button variant="outline">View Details</Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Health Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Tips & Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Stay Hydrated", message: "Remember to drink at least 8 glasses of water today!", color: "bg-blue-50 text-blue-700" },
                      { title: "Exercise Reminder", message: "You're 2 days away from your weekly exercise goal. Keep it up!", color: "bg-green-50 text-green-700" },
                      { title: "Medication Alert", message: "Don't forget to take your evening medication in 30 minutes.", color: "bg-yellow-50 text-yellow-700" }
                    ].map((tip, index) => (
                      <div key={index} className={`rounded-lg ${tip.color} p-4`}>
                        <h3 className="font-semibold">{tip.title}</h3>
                        <p className="text-sm">{tip.message}</p>
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
