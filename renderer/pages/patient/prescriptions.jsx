'use client'

import { useState } from 'react'
import { Calendar, Clock, MoreVertical, Share2, Plus, Search, Pill } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from 'react-toastify' // Ensure correct import path for your toast library
import Sidebar from "@/components/patient/Sidebar"
import Header from "@/components/patient/Header"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PrescriptionsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [prescriptions, setPrescriptions] = useState([
        { id: 1, name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", startDate: "2023-06-01", endDate: "2023-06-10", doctor: "Dr. Sarah Wilson" },
        { id: 2, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", startDate: "2023-05-15", endDate: "2023-07-15", doctor: "Dr. Michael Chen" },
        { id: 3, name: "Metformin", dosage: "1000mg", frequency: "Twice daily", startDate: "2023-04-01", endDate: "2023-10-01", doctor: "Dr. Emily Johnson" },
        { id: 4, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", startDate: "2023-03-15", endDate: "2023-09-15", doctor: "Dr. David Lee" },
        { id: 5, name: "Levothyroxine", dosage: "100mcg", frequency: "Once daily", startDate: "2023-01-01", endDate: "2023-12-31", doctor: "Dr. Lisa Chen" },
    ])

    const filteredPrescriptions = prescriptions.filter(prescription =>
        prescription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const sharePrescription = (prescriptionId) => {
        // In a real application, this would trigger an API call or open a sharing dialog
        toast.success("Prescription Shared", {
        });
    }

    return (
        <>
            <div className="flex min-h-screen bg-[#F0F4F8]">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1 overflow-hidden">
                    <Header setSidebarOpen={setSidebarOpen} />
                    <ScrollArea className="h-[calc(100vh-5rem)]">
                        <main className="p-6">
                            <div className="container mx-auto p-6 bg-[#F0F4F8]">
                                <h1 className="text-3xl font-bold text-[#1A365D] mb-6">My Prescriptions</h1>
                                
                                <div className="flex justify-between items-center mb-6">
                                    <div className="relative w-64">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            type="search"
                                            placeholder="Search prescriptions..."
                                            className="pl-8 bg-white"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white">
                                                <Plus className="mr-2 h-4 w-4" /> Add New Prescription
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <form>
                                                <DialogHeader>
                                                    <DialogTitle>Add New Prescription</DialogTitle>
                                                    <DialogDescription>
                                                        Enter the details for the new prescription. Click save when you're done.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                            Name
                                                        </Label>
                                                        <Input id="name" name="name" className="col-span-3" required />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="dosage" className="text-right">
                                                            Dosage
                                                        </Label>
                                                        <Input id="dosage" name="dosage" className="col-span-3" required />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="frequency" className="text-right">
                                                            Frequency
                                                        </Label>
                                                        <Input id="frequency" name="frequency" className="col-span-3" required />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="startDate" className="text-right">
                                                            Start Date
                                                        </Label>
                                                        <Input id="startDate" name="startDate" type="date" className="col-span-3" required />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="endDate" className="text-right">
                                                            End Date
                                                        </Label>
                                                        <Input id="endDate" name="endDate" type="date" className="col-span-3" required />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="doctor" className="text-right">
                                                            Doctor
                                                        </Label>
                                                        <Input id="doctor" name="doctor" className="col-span-3" required />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white">Save Prescription</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Active Prescriptions</CardTitle>
                                        <CardDescription>Manage your current medications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[600px] pr-4">
                                            {filteredPrescriptions.map((prescription) => (
                                                <div key={prescription.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <Pill className="h-6 w-6 text-[#4FD1C5]" />
                                                            <div>
                                                                <h3 className="font-semibold text-[#2D3748]">{prescription.name}</h3>
                                                                <p className="text-sm text-gray-500">{prescription.dosage} - {prescription.frequency}</p>
                                                                <p className="text-sm text-gray-500">Prescribed by {prescription.doctor}</p>
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onSelect={() => sharePrescription(prescription.id)}>
                                                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Calendar className="mr-2 h-4 w-4" /> Refill
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Clock className="mr-2 h-4 w-4" /> Schedule Reminder
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
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
        </>
    )
}
