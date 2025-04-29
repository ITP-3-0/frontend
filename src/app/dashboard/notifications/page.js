"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, BellRing, AlertTriangle, Calendar, Clock, CheckCircle, RefreshCw, ExternalLink } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/Firebase/AuthContext"
import { Spinner } from "@/components/ui/spinner"
import axios from "axios"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500">Something went wrong. Please try again later.</div>
    }
    return this.props.children
  }
}

export default function NotificationsView() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { user, loading } = useAuth()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      // Pass the current user's information to the API
      const response = await axios.get(`/api/notifications/user/notifications`, {
        params: {
          username: user.displayName || user.email,
          role: user.role || "client" // Default to client if role is not available
        }
      })
      setNotifications(response.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to fetch notifications. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      // Optimistic update
      const updatedNotifications = notifications.map(notif => 
        notif._id === notificationId 
          ? { ...notif, isRead: true } 
          : notif
      )
      setNotifications(updatedNotifications)
      
      // API call to mark notification as read
      await axios.put(`/api/notifications/read/${notificationId}`, {
        username: user.displayName || user.email
      })
      
      toast({
        title: "Success",
        description: "Notification marked as read",
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
      
      // Revert on error
      fetchNotifications()
    }
  }

  const markAllAsRead = async () => {
    try {
      // Optimistic update
      const updatedNotifications = notifications.map(notif => 
        ({ ...notif, isRead: true })
      )
      setNotifications(updatedNotifications)
      
      // API call to mark all notifications as read
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, {
        username: user.displayName || user.email,
        role: user.role || "client" // Default to client if role is not available
      })
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
      
      // Revert on error
      fetchNotifications()
    }
  }

  const viewNotificationDetails = (notification) => {
    setSelectedNotification(notification)
    setIsDialogOpen(true)
    
    // If notification is unread, mark it as read
    if (!notification.isRead) {
      markAsRead(notification._id)
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setPriorityFilter("all")
    setStatusFilter("all")
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "ticket":
        return "🎫";
      case "forum":
        return "💬";
      case "system":
        return "🔔";
      case "alert":
        return "⚠️";
      default:
        return "📌";
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-slate-200 hover:bg-slate-200 text-slate-700";
      case "medium":
        return "bg-blue-200 hover:bg-blue-200 text-slate-800";
      case "high":
        return "bg-amber-100 hover:bg-amber-200 text-amber-700";
      case "urgent":
        return "bg-red-100 hover:bg-red-200 text-red-700";
      default:
        return "bg-slate-100 hover:bg-slate-200 text-slate-700";
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "read" && notification.isRead) || 
      (statusFilter === "unread" && !notification.isRead);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-12 w-12 text-black dark:text-slate-500" />
          <p className="text-muted-foreground animate-pulse">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-1 flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <div className="@container/main flex flex-1 flex-col gap-2 py-8">
          <div className="flex flex-col gap-4 md:gap-6 px-4 lg:px-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-2">
              <BellRing className="h-6 w-6 text-black dark:text-slate-500" />
              <h1 className="text-2xl font-bold">My Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-black text-white dark:bg-slate-600">
                  {unreadCount} unread
                </Badge>
              )}
            </div>

            <Card className="border-none shadow-lg">
              <CardHeader className="bg-slate-100/50 dark:bg-slate-800/10 rounded-t-lg border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BellRing className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription className="mt-1">
                      View all your system and communication notifications
                    </CardDescription>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={unreadCount === 0}
                    onClick={markAllAsRead}
                    className="text-sm"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark all as read
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search notifications..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Priority: {priorityFilter === "all" ? "All" : priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All Priorities</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPriorityFilter("urgent")}>Urgent</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setStatusFilter("read")}>Read</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("unread")}>Unread</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={resetFilters}
                        className="w-full sm:w-auto"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Spinner className="h-6 w-6 text-black dark:text-slate-500" />
                    <p className="ml-2 text-muted-foreground animate-pulse">Loading notifications...</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-12 text-center text-slate-500">
                        <BellRing className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <p>No notifications found. Try adjusting your search or filters.</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <div 
                          key={notification._id}
                          className={cn(
                            "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer",
                            !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/5"
                          )}
                          onClick={() => viewNotificationDetails(notification)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xl" role="img" aria-label={notification.type}>
                                  {getTypeIcon(notification.type)}
                                </span>
                                <h3 className={cn("font-medium", !notification.isRead && "font-semibold")}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                                )}
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {notification.message.length > 120
                                  ? `${notification.message.substring(0, 120)}...`
                                  : notification.message}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-slate-500">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {new Date(notification.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-md">
                {selectedNotification && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span className="text-xl" role="img" aria-label={selectedNotification.type}>
                          {getTypeIcon(selectedNotification.type)}
                        </span>
                        {selectedNotification.title}
                        <Badge className={getPriorityColor(selectedNotification.priority)}>
                          {selectedNotification.priority}
                        </Badge>
                      </DialogTitle>
                      <DialogDescription>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(selectedNotification.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="text-sm">
                        {selectedNotification.message}
                      </div>
                      
                      {selectedNotification.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={selectedNotification.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View details
                          </a>
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            <Toaster />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}