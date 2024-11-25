'use client'

import { useState ,React } from 'react'
import { FileText, Plus, Search } from 'lucide-react'
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
import { Textarea } from "@/components/ui/textarea"
import Sidebar from '../../components/doctor/Sidebar'
import Header from '../../components/doctor/Header'

export default function PrescriptionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false)
  const [newPrescription, setNewPrescription] = useState({
    patient: '',
    medication: '',
    dosage: '',
    duration: '',
    instructions: ''
  })

  const handleNewPrescriptionChange = (e) => {
    const { name, value } = e.target
    setNewPrescription(prev => ({ ...prev, [name]: value }))
  }

  const handleNewPrescriptionSubmit = (e) => {
    e.preventDefault()
    console.log('New prescription submitted:', newPrescription)
    // Here you would typically send this data to your backend
    setIsNewPrescriptionOpen(false)
    setNewPrescription({
      patient: '',
      medication: '',
      dosage: '',
      duration: '',
      instructions: ''
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
                  <CardTitle className="text-2xl">Prescriptions</CardTitle>
                  <p className="text-blue-100">Manage and create prescriptions for your patients</p>
                </CardHeader>
                <CardContent>
                  <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-gray-800 hover:bg-gray-100">
                        <Plus className="mr-2 h-4 w-4" />
                        New Prescription
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create New Prescription</DialogTitle>
                        <DialogDescription>
                          Fill in the details for the new prescription. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleNewPrescriptionSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="patient" className="text-right">
                              Patient
                            </Label>
                            <Input
                              id="patient"
                              name="patient"
                              value={newPrescription.patient}
                              onChange={handleNewPrescriptionChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="medication" className="text-right">
                              Medication
                            </Label>
                            <Input
                              id="medication"
                              name="medication"
                              value={newPrescription.medication}
                              onChange={handleNewPrescriptionChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dosage" className="text-right">
                              Dosage
                            </Label>
                            <Input
                              id="dosage"
                              name="dosage"
                              value={newPrescription.dosage}
                              onChange={handleNewPrescriptionChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration" className="text-right">
                              Duration
                            </Label>
                            <Input
                              id="duration"
                              name="duration"
                              value={newPrescription.duration}
                              onChange={handleNewPrescriptionChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="instructions" className="text-right">
                              Instructions
                            </Label>
                            <Textarea
                              id="instructions"
                              name="instructions"
                              value={newPrescription.instructions}
                              onChange={handleNewPrescriptionChange}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save Prescription</Button>
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
                    placeholder="Search prescriptions..."
                    className="pl-8"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prescriptions</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="recent">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="patient-az">Patient Name A-Z</SelectItem>
                    <SelectItem value="patient-za">Patient Name Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prescriptions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prescriptions.map((prescription, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[--first]" />
                            <h3 className="font-semibold">{prescription.patient}</h3>
                          </div>
                          <p className="text-sm text-gray-500">
                            {prescription.medication} - {prescription.dosage}
                          </p>
                          <p className="text-sm text-gray-500">
                            Prescribed: {prescription.date}
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                prescription.status === 'Active'
                                  ? 'bg-green-100 text-green-700'
                                  : prescription.status === 'Completed'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {prescription.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              Duration: {prescription.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Print
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            Cancel
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

const prescriptions = [
  {
    patient: "John Doe",
    medication: "Amoxicillin",
    dosage: "500mg - 3 times daily",
    duration: "7 days",
    date: "Nov 26, 2023",
    status: "Active"
  },
  {
    patient: "Jane Smith",
    medication: "Lisinopril",
    dosage: "10mg - Once daily",
    duration: "30 days",
    date: "Nov 25, 2023",
    status: "Active"
  },
  {
    patient: "Mike Johnson",
    medication: "Metformin",
    dosage: "1000mg - Twice daily",
    duration: "90 days",
    date: "Nov 24, 2023",
    status: "Completed"
  },
  {
    patient: "Sarah Williams",
    medication: "Omeprazole",
    dosage: "20mg - Once daily",
    duration: "14 days",
    date: "Nov 23, 2023",
    status: "Cancelled"
  },
  {
    patient: "David Brown",
    medication: "Atorvastatin",
    dosage: "40mg - Once daily",
    duration: "30 days",
    date: "Nov 22, 2023",
    status: "Active"
  }
]

