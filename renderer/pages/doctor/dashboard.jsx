'use client'

import { useState } from 'react'
import { Bell, Calendar, ChevronDown, FileText, Home, Menu, MessageSquare, Search, Settings, Users, X } from 'lucide-react'
import { Activity, Clipboard, Stethoscope, Target } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import Header from "@/components/doctor/Header" // Adjust the import path based on your file structure
import Sidebar from "@/components/doctor/Sidebar" // Adjust the import path based on your file structure

export default function DoctorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Dashboard Content */}
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <main className="p-6">
            <div className="grid gap-6">
              {/* Welcome Card */}
              <Card className="bg-gradient-to-r from-[--first] to-[--second] text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome back, Dr. Smith!</CardTitle>
                  <CardDescription className="text-blue-100">Here's an overview of your day.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-200">Next Appointment</p>
                      <p className="text-lg font-semibold">In 30 minutes</p>
                      <p className="text-sm text-blue-200">with Patient John Doe</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-200">Today's Schedule</p>
                      <Progress value={60} className="mt-2 bg-blue-300" />
                      <p className="mt-1 text-sm text-blue-200">12 out of 20 appointments completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: "View Schedule", description: "Check your appointments", action: "View", color: "bg-[--second]" },
                  { title: "Patient Records", description: "Access medical histories", action: "Open", color: "bg-[--first]" },
                  { title: "Write Prescription", description: "Create new prescriptions", action: "Start", color: "bg-[--second]" },
                  { title: "Lab Results", description: "Review recent lab work", action: "Review", color: "bg-[--first]" },
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
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-[#EDF2F7] p-1 rounded-lg">
                  {["Appointments", "Patients", "Prescriptions", "Lab Results"].map((tab) => (
                    <TabsTrigger key={tab} value={tab.toLowerCase().replace(' ', '-')} className="rounded-md data-[state=active]:bg-white">
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="appointments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { patient: "John Doe", time: "10:00 AM", type: "Check-up" },
                          { patient: "Jane Smith", time: "11:30 AM", type: "Follow-up" },
                          { patient: "Mike Johnson", time: "2:00 PM", type: "Consultation" }
                        ].map((appointment, index) => (
                          <div key={index} className="flex items-center justify-between rounded-lg bg-[#EDF2F7] p-4">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{appointment.patient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{appointment.patient}</h3>
                                <p className="text-sm text-gray-500">{appointment.time} - {appointment.type}</p>
                              </div>
                            </div>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm">View Details</Button>
                              <Button variant="ghost" size="sm">Reschedule</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="patients" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Emily Johnson", age: 35, lastVisit: "2 days ago", condition: "Hypertension" },
                          { name: "Michael Chen", age: 28, lastVisit: "1 week ago", condition: "Diabetes" },
                          { name: "Sarah Williams", age: 42, lastVisit: "3 days ago", condition: "Arthritis" }
                        ].map((patient, index) => (
                          <div key={index} className="rounded-lg bg-[#EDF2F7] p-4">
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-gray-500">Age: {patient.age} | Last Visit: {patient.lastVisit}</p>
                            <p className="text-sm text-gray-500">Condition: {patient.condition}</p>
                            <div className="mt-2 space-x-2">
                              <Button variant="outline" size="sm">View Records</Button>
                              <Button variant="ghost" size="sm">Schedule Follow-up</Button>
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
                      <CardTitle>Recent Prescriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { patient: "John Doe", medication: "Amoxicillin", dosage: "500mg - 3 times daily", duration: "7 days" },
                          { patient: "Jane Smith", medication: "Lisinopril", dosage: "10mg - Once daily", duration: "30 days" },
                          { patient: "Mike Johnson", medication: "Metformin", dosage: "1000mg - Twice daily", duration: "90 days" }
                        ].map((prescription, index) => (
                          <div key={index} className="rounded-lg bg-[#EDF2F7] p-4">
                            <h3 className="font-semibold">{prescription.patient}</h3>
                            <p className="text-sm text-gray-500">{prescription.medication} - {prescription.dosage}</p>
                            <p className="text-sm text-gray-500">Duration: {prescription.duration}</p>
                            <div className="mt-2 space-x-2">
                              <Button variant="outline" size="sm">Edit Prescription</Button>
                              <Button variant="ghost" size="sm">Print</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="lab-results" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Lab Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { patient: "Emily Johnson", test: "Complete Blood Count", date: "2 days ago", status: "Normal" },
                          { patient: "Michael Chen", test: "Lipid Panel", date: "1 week ago", status: "Abnormal" },
                          { patient: "Sarah Williams", test: "Thyroid Function", date: "3 days ago", status: "Pending" }
                        ].map((result, index) => (
                          <div key={index} className="flex items-center justify-between rounded-lg bg-[#EDF2F7] p-4">
                            <div>
                              <h3 className="font-semibold">{result.patient}</h3>
                              <p className="text-sm text-gray-500">{result.test}</p>
                              <p className="text-sm text-gray-500">Date: {result.date}</p>
                            </div>
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                result.status === 'Normal' ? 'bg-green-100 text-green-800' :
                                result.status === 'Abnormal' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {result.status}
                              </span>
                              <Button variant="outline" size="sm" className="ml-2">View Details</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Medical Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical Insights & Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Patient Follow-up", message: "Remember to follow up with John Doe about his blood pressure medication.", color: "bg-blue-50 text-blue-700" },
                      { title: "New Research", message: "Recent study on diabetes treatment published in JAMA. Consider reviewing for potential application.", color: "bg-green-50 text-green-700" },
                      { title: "Vaccination Campaign", message: "Flu vaccination campaign starts next week. Prepare patient recommendations.", color: "bg-yellow-50 text-yellow-700" }
                    ].map((insight, index) => (
                      <div key={index} className={`rounded-lg ${insight.color} p-4`}>
                        <h3 className="font-semibold">{insight.title}</h3>
                        <p className="text-sm">{insight.message}</p>
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
