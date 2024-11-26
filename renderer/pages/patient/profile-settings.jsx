'use client'

import { useState } from 'react'
import { Bell, Calendar, ChevronRight, Key, Lock, Menu, Moon, Settings, Sun, User, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DoctorSettingsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-[#F0F4F8]">
            {/* Sidebar */}
            {/* Main Content */}
            <div className="flex-1 overflow-hidden">

                {/* Settings Content */}
                <ScrollArea className="h-[calc(100vh-5rem)]">
                    <main className="p-6 ">
                        <Card className="my-2">
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>Update your account details here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" placeholder="Dr. John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="specialty">Specialty</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select specialty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cardiology">Cardiology</SelectItem>
                                            <SelectItem value="dermatology">Dermatology</SelectItem>
                                            <SelectItem value="neurology">Neurology</SelectItem>
                                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea id="bio" placeholder="Tell us about yourself" />
                                </div>
                                <Button>Save Changes</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>Manage your account security.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                                <Button>Update Security Settings</Button>
                            </CardContent>
                        </Card>

                    </main>
                </ScrollArea>
            </div>
        </div>
    )
}

