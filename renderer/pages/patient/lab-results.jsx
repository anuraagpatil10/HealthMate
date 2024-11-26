'use client'

import { useState } from 'react'
import { Search, Download, FileText, Calendar, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header" // Adjust the import path based on your file structure
import Sidebar from "@/components/Sidebar" // Adjust the import path based on your file structure

export default function LabReportsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const labReports = [
    { id: 1, testName: "Complete Blood Count (CBC)", date: "2023-06-15", status: "Normal", doctor: "Dr. Sarah Wilson", category: "Hematology" },
    { id: 2, testName: "Lipid Panel", date: "2023-06-10", status: "Abnormal", doctor: "Dr. Michael Chen", category: "Cardiology" },
    { id: 3, testName: "Thyroid Function Test", date: "2023-05-28", status: "Normal", doctor: "Dr. Emily Johnson", category: "Endocrinology" },
    { id: 4, testName: "Liver Function Test", date: "2023-05-20", status: "Critical", doctor: "Dr. David Lee", category: "Gastroenterology" },
    { id: 5, testName: "Urinalysis", date: "2023-05-15", status: "Normal", doctor: "Dr. Lisa Chen", category: "Urology" },
  ]

  const filteredReports = labReports.filter(report => 
    (report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.doctor.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'all' || report.category === categoryFilter)
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-800'
      case 'Abnormal':
        return 'bg-yellow-100 text-yellow-800'
      case 'Critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const downloadReport = (reportId) => {
    // In a real application, this would trigger a download of the report
    console.log(`Downloading report ${reportId}`)
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <div className="container mx-auto p-6 bg-[#F0F4F8]">
          <h1 className="text-3xl font-bold text-[#1A365D] mb-6">Lab Reports</h1>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Hematology">Hematology</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                <SelectItem value="Urology">Urology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Lab Reports</CardTitle>
              <CardDescription>View and download your recent lab test results</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.testName}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        </TableCell>
                        <TableCell>{report.doctor}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="mr-2">View</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px]">
                              <DialogHeader>
                                <DialogTitle>{report.testName}</DialogTitle>
                                <DialogDescription>
                                  Detailed results for your lab test
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <span className="font-semibold">Test Date:</span>
                                  <span>{report.date}</span>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <span className="font-semibold">Status:</span>
                                  <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <span className="font-semibold">Doctor:</span>
                                  <span>{report.doctor}</span>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                  <span className="font-semibold">Category:</span>
                                  <span>{report.category}</span>
                                </div>
                                {/* Add more detailed results here */}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => downloadReport(report.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
