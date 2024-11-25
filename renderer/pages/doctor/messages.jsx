'use client'

import { useState } from 'react'
import { MessageSquare, Search, Send, Phone, Video } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Sidebar from '../../components/doctor/Sidebar'
import Header from '../../components/doctor/Header'

export default function MessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = (e) => {
    e.preventDefault()
    console.log('Sending message:', newMessage)
    // Here you would typically send this message to your backend
    setNewMessage('')
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <div className="h-[calc(100vh-5rem)] flex">
          {/* Conversations List */}
          <Card className="w-1/3 border-r">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-13rem)]">
                {conversations.map((conversation, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 ${
                      selectedConversation === conversation.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{conversation.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="flex-shrink-0 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={conversations[0].avatar} alt={conversations[0].name} />
                        <AvatarFallback>{conversations[0].name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{conversations[0].name}</CardTitle>
                        <p className="text-sm text-gray-500">Online</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  {/* Chat messages would go here */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Avatar>
                        <AvatarImage src={conversations[0].avatar} alt={conversations[0].name} />
                        <AvatarFallback>{conversations[0].name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-2 max-w-[70%]">
                        <p>Hello Dr. Smith, I've been experiencing some discomfort in my lower back. Can you advise?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 justify-end">
                      <div className="bg-[--first] text-white rounded-lg p-2 max-w-[70%]">
                        <p>Hello! I'm sorry to hear that. Can you describe the pain? Is it sharp or dull? Does it radiate to other areas?</p>
                      </div>
                      <Avatar>
                        <AvatarFallback>DS</AvatarFallback>
                      </Avatar>
                    </div>
                    {/* More messages would be added here */}
                  </div>
                </ScrollArea>
                <CardContent className="flex-shrink-0 border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                  <h2 className="mt-2 font-semibold text-xl">No Conversation Selected</h2>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

const conversations = [
  {
    id: '1',
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hello Dr. Smith, I've been experiencing...",
    time: "10:30 AM"
  },
  {
    id: '2',
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for the prescription. I...",
    time: "Yesterday"
  },
  {
    id: '3',
    name: "Carol Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "When is my next appointment?",
    time: "2 days ago"
  },
  {
    id: '4',
    name: "David Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'm feeling much better now, thanks!",
    time: "1 week ago"
  },
  {
    id: '5',
    name: "Eva Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can we reschedule my appointment?",
    time: "2 weeks ago"
  }
]

