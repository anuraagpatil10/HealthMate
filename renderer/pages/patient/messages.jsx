'use client'

import { useState } from 'react'
import { Search, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/patient/Header" // Adjust the import path based on your file structure
import Sidebar from "@/components/patient/Sidebar" // Adjust the import path based on your file structure

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const contacts = [
    { id: 1, name: "Dr. Sarah Wilson", role: "Cardiologist", lastMessage: "Your test results are ready.", lastMessageTime: "10:30 AM", unreadCount: 1 },
    { id: 2, name: "Dr. Michael Chen", role: "General Physician", lastMessage: "How are you feeling today?", lastMessageTime: "Yesterday", unreadCount: 0 },
    { id: 3, name: "Nurse Emily", role: "Nurse", lastMessage: "Your appointment is confirmed.", lastMessageTime: "Yesterday", unreadCount: 2 },
    { id: 4, name: "Dr. David Lee", role: "Orthopedic Surgeon", lastMessage: "Please call me when you can.", lastMessageTime: "2 days ago", unreadCount: 0 },
    { id: 5, name: "Reception", role: "Admin", lastMessage: "Your prescription is ready.", lastMessageTime: "3 days ago", unreadCount: 1 },
  ]

  const messages = {
    1: [
      { id: 1, senderId: 1, content: "Hello! Your latest test results are ready. Everything looks good!", timestamp: "10:30 AM" },
      { id: 2, senderId: 0, content: "That's great news! Thank you for letting me know.", timestamp: "10:35 AM" },
      { id: 3, senderId: 1, content: "You're welcome. Do you have any questions about the results?", timestamp: "10:37 AM" },
    ],
    2: [
      { id: 1, senderId: 2, content: "Good morning! How are you feeling today?", timestamp: "Yesterday, 9:00 AM" },
      { id: 2, senderId: 0, content: "Good morning, Dr. Chen. I'm feeling much better, thank you.", timestamp: "Yesterday, 9:15 AM" },
      { id: 3, senderId: 2, content: "That's wonderful to hear. Keep taking your medication as prescribed.", timestamp: "Yesterday, 9:20 AM" },
    ],
    // Add messages for other contacts as needed
  }

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sendMessage = () => {
    if (selectedContact && newMessage.trim()) {
      const newMessageObj = {
        id: messages[selectedContact.id].length + 1,
        senderId: 0, // 0 represents the current user
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      messages[selectedContact.id] = [...messages[selectedContact.id], newMessageObj]
      setNewMessage('')
      // In a real app, you would also update the lastMessage and lastMessageTime for the contact
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <div className="container mx-auto p-6 bg-[#F0F4F8] h-screen">
          <h1 className="text-3xl font-bold text-[#1A365D] mb-6">Messages</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-150px)]">
            {/* Contacts List */}
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="mb-4">
                  <Search className="absolute ml-2 mt-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search contacts..."
                    className="pl-8 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-[calc(100vh-250px)]">
                  {filteredContacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`mb-2 p-2 rounded-lg cursor-pointer ${selectedContact?.id === contact.id ? 'bg-[#4FD1C5] text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?${contact.id}`} alt={contact.name} />
                          <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{contact.name}</h3>
                          <p className="text-sm text-gray-500">{contact.role}</p>
                        </div>
                        {contact.unreadCount > 0 && (
                          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {contact.unreadCount}
                          </div>
                        )}
                      </div>
                      <p className="text-sm mt-1 truncate">{contact.lastMessage}</p>
                      <p className="text-xs text-right mt-1">{contact.lastMessageTime}</p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="h-full">
              <CardContent className="p-4 flex flex-col h-full">
                {selectedContact ? (
                  <>
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?${selectedContact.id}`} alt={selectedContact.name} />
                        <AvatarFallback>{selectedContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-lg">{selectedContact.name}</h2>
                        <p className="text-sm text-gray-500">{selectedContact.role}</p>
                      </div>
                    </div>
                    <ScrollArea className="flex-1 mb-4">
                      {messages[selectedContact.id]?.map((message) => (
                        <div key={message.id} className={`mb-2 ${message.senderId === 0 ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block p-2 rounded-lg ${message.senderId === 0 ? 'bg-[#4FD1C5] text-white' : 'bg-gray-100'}`}>
                            {message.content}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                        </div>
                      ))}
                    </ScrollArea>
                    <div className="flex space-x-2">
                      <Textarea 
                        placeholder="Type your message here..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a contact to start chatting
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
