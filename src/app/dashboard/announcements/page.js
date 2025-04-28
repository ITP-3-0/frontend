"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, X, Mail, BellRing, Loader2, Calendar, AlertTriangle, Clock, MoreHorizontal, Edit, Trash2, RefreshCw } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/Firebase/AuthContext"
import { Spinner } from "@/components/ui/spinner"
import { addNotificationHandler } from "@/utils/notificationUtils"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

export default function Notifications() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [notificationSearchTerm, setNotificationSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "alert",
    priority: "medium",
    targetUsers: [],
    targetRoles: [],
    isEmailable: false,
    scheduleAt: "",
    isScheduled: false,
  })

  // Available roles
  const availableRoles = ["client", "agent_l1", "agent_l2", "admin"]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users")
        setUsers(response.data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }
    fetchUsers()

    // Fetch notifications on component mount
    fetchNotifications()
  }, [])

  const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(notificationSearchTerm.toLowerCase()) || 
                          notification.message.toLowerCase().includes(notificationSearchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    const newValue = type === "checkbox" ? e.target.checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }

  const toggleUserSelection = (username) => {
    setFormData((prev) => {
      const isSelected = prev.targetUsers.includes(username)
      return {
        ...prev,
        targetUsers: isSelected ? prev.targetUsers.filter((u) => u !== username) : [...prev.targetUsers, username],
      }
    })
  }

  const toggleRoleSelection = (role) => {
    setFormData((prev) => {
      const isSelected = prev.targetRoles.includes(role)
      return {
        ...prev,
        targetRoles: isSelected ? prev.targetRoles.filter((r) => r !== role) : [...prev.targetRoles, role],
      }
    })
  }

  const fetchNotifications = async () => {
    setIsFetching(true)
    try {
      const response = await axios.get("/api/notifications")
      setNotifications(response.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to fetch notifications. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }

  const addNotification = async () => {
    const result = await addNotificationHandler(formData, toast, setFormData, setIsLoading)
    if (result === false) return
  }

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "alert",
      priority: "medium",
      targetUsers: [],
      targetRoles: [],
      isEmailable: false,
      scheduleAt: "",
      isScheduled: false,
    });
  };

  const editNotification = (notification) => {
    setSelectedNotification(notification)
    setFormData({
      ...notification,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      targetUsers: notification.targetUsers || [],
      targetRoles: notification.targetRoles || [],
      isEmailable: notification.isEmailable || false,
      isScheduled: notification.isScheduled || false,
      scheduleAt: notification.scheduleAt || "",
    })
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateNotification = async () => {
    if (!selectedNotification) return
    
    setIsLoading(true)
    
    // Store original notifications for potential rollback
    const originalNotifications = [...notifications]
    
    // Optimistically update the UI
    const optimisticUpdate = notifications.map(n => 
      n._id === selectedNotification._id 
        ? { 
            ...formData, 
            _id: selectedNotification._id,
            createdAt: selectedNotification.createdAt,
            updatedAt: new Date().toISOString() 
          } 
        : n
    )
    
    setNotifications(optimisticUpdate)
    
    try {
      // Make the API call
      const response = await axios.put(`/api/notifications/${selectedNotification._id}`, formData)
      
      // Update with the actual server response data
      const updatedNotifications = notifications.map(n => 
        n._id === selectedNotification._id 
          ? response.data
          : n
      )
      
      setNotifications(updatedNotifications)
      
      toast({
        title: "Success",
        description: "Notification updated successfully",
      })
      
      resetForm()
      setSelectedNotification(null)
    } catch (error) {
      // Revert to original state if the API call fails
      setNotifications(originalNotifications)
      
      console.error("Error updating notification:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update notification",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return
    
    // Store original notifications for potential rollback
    const originalNotifications = [...notifications]
    
    // Optimistically update UI
    setNotifications(notifications.filter(n => n._id !== _id))
    
    try {
      // Make the API call
      await axios.delete(`/api/notifications/${_id}`)
      
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      })
    } catch (error) {
      // Revert to original state if the API call fails
      setNotifications(originalNotifications)
      
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  const { user, loading } = useAuth()

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-slate-200 hover:bg-slate-200 text-slate-700"
      case "medium":
        return "bg-blue-200 hover:bg-slate-400 text-slate-800"
      case "high":
        return "bg-amber-100 hover:bg-amber-200 text-amber-700"
      case "urgent":
        return "bg-red-100 hover:bg-red-200 text-red-700"
      default:
        return "bg-slate-100 hover:bg-slate-200 text-slate-700"
    }
  }

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
              <h1 className="text-2xl font-bold">Notification Center</h1>
            </div>

            <Card className="border-none shadow-lg">
              <CardHeader className="bg-slate-100/50 dark:bg-slate-800/10 rounded-t-lg border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BellRing className="h-5 w-5" />
                      {selectedNotification ? "Edit Announcement" : "Send Announcement"}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {selectedNotification ? "Update an existing announcement" : "Create and send announcements to your team or Teachers"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter announcement title"
                      value={formData.title}
                      onChange={handleChange}
                      className="transition-all focus-visible:ring-slate-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="flex gap-2 flex-wrap">
                      {["low", "medium", "high", "urgent"].map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant="outline"
                          onClick={() => !isLoading && setFormData({ ...formData, priority: level })}
                          className={cn(
                            "transition-all",
                            formData.priority === level ? getPriorityColor(level) : "hover:bg-slate-100",
                          )}
                          size="sm"
                          disabled={isLoading}
                        >
                          {level === "urgent" && <AlertTriangle className="mr-1 h-3 w-3" />}
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Enter your message here"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="resize-y min-h-[120px] transition-all focus-visible:ring-slate-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950/30 rounded-lg transition-all">
                      <Switch
                        id="isScheduled"
                        name="isScheduled"
                        checked={formData.isScheduled}
                        onCheckedChange={(checked) => setFormData({ ...formData, isScheduled: checked })}
                        disabled={isLoading}
                        className="data-[state=checked]:bg-black data-[state=checked]:border-black dark:data-[state=checked]:bg-slate-500 dark:data-[state=checked]:border-slate-500"
                      />
                      <Label
                        htmlFor="isScheduled"
                        className={`cursor-pointer flex items-center gap-2 ${isLoading ? "opacity-50" : ""}`}
                      >
                        <Calendar className="w-4 h-4 text-black dark:text-slate-400" />
                        <span>Schedule for later</span>
                      </Label>
                    </div>

                    {formData.isScheduled && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-left-5 duration-300">
                        <Label htmlFor="scheduleAt" className="text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Schedule Date & Time
                        </Label>
                        <Input
                          id="scheduleAt"
                          name="scheduleAt"
                          type="datetime-local"
                          value={formData.scheduleAt}
                          onChange={handleChange}
                          className="transition-all focus-visible:ring-slate-500"
                          disabled={isLoading}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg transition-all">
                      <Switch
                        id="isEmailable"
                        name="isEmailable"
                        checked={formData.isEmailable}
                        onCheckedChange={(checked) => setFormData({ ...formData, isEmailable: checked })}
                        disabled={isLoading}
                        className="data-[state=checked]:bg-black data-[state=checked]:border-black dark:data-[state=checked]:bg-slate-500 dark:data-[state=checked]:border-slate-500"
                      />
                      <Label
                        htmlFor="isEmailable"
                        className={`cursor-pointer flex items-center gap-2 ${isLoading ? "opacity-50" : ""}`}
                      >
                        <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Also send as email</span>
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Tabs defaultValue="roles" className="w-full">
                      <TabsList className="grid grid-cols-2 mb-2">
                        <TabsTrigger
                          value="roles"
                          disabled={isLoading}
                          className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-slate-500"
                        >
                          Target Roles
                        </TabsTrigger>
                        <TabsTrigger
                          value="users"
                          disabled={isLoading}
                          className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-slate-500"
                        >
                          Target Users
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent
                        value="roles"
                        className="mt-0 border rounded-lg p-4 bg-white dark:bg-slate-950/50 shadow-sm"
                      >
                        <div className="flex flex-wrap gap-2">
                          {availableRoles.map((role) => (
                            <Badge
                              key={role}
                              variant={formData.targetRoles.includes(role) ? "default" : "outline"}
                              className={`cursor-pointer py-2 px-3 text-sm transition-all ${
                                formData.targetRoles.includes(role)
                                  ? "bg-black dark:bg-slate-500 hover:bg-slate-700 dark:hover:bg-black"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-900/20"
                              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                              onClick={() => !isLoading && toggleRoleSelection(role)}
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="users"
                        className="mt-0 border rounded-lg p-4 bg-white dark:bg-slate-950/50 shadow-sm"
                      >
                        <div className="mb-4 relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Search users..."
                            className="pl-10 transition-all focus-visible:ring-slate-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>

                        <div className="border rounded-md max-h-[180px] overflow-y-auto">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <div
                                key={user._id}
                                className={`flex items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                                  formData.targetUsers.includes(user.username) ? "bg-slate-50 dark:bg-slate-900/20" : ""
                                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => !isLoading && toggleUserSelection(user.username)}
                              >
                                <Checkbox
                                  checked={formData.targetUsers.includes(user.username)}
                                  className="mr-2 data-[state=checked]:bg-black data-[state=checked]:border-black dark:data-[state=checked]:bg-slate-500 dark:data-[state=checked]:border-slate-500"
                                  disabled={isLoading}
                                />
                                <span>{user.username}</span>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-slate-500">No users found</div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>

                {(formData.targetRoles.length > 0 || formData.targetUsers.length > 0) && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border animate-in fade-in duration-300">
                    <h3 className="text-sm font-medium mb-2">Selected Recipients:</h3>
                    <div className="flex flex-col gap-2">
                      {formData.targetRoles.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="text-xs text-slate-500 mr-1">Roles:</span>
                          {formData.targetRoles.map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/20"
                            >
                              {role}
                              {!isLoading && (
                                <X
                                  className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
                                  onClick={() => toggleRoleSelection(role)}
                                />
                              )}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {formData.targetUsers.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="text-xs text-slate-500 mr-1">Users:</span>
                          {formData.targetUsers.map((user) => (
                            <Badge
                              key={user}
                              variant="secondary"
                              className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/20"
                            >
                              {user}
                              {!isLoading && (
                                <X
                                  className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
                                  onClick={() => toggleUserSelection(user)}
                                />
                              )}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-end gap-2 pt-2 pb-6">
                <Button
                  variant="outline"
                  className="transition-all hover:bg-slate-100"
                  disabled={isLoading}
                  onClick={() => {
                    resetForm()
                    setSelectedNotification(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={selectedNotification ? updateNotification : addNotification}
                  disabled={isLoading}
                  className="transition-all bg-black dark:bg-slate-500 hover:bg-slate-700 dark:hover:bg-black"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {selectedNotification ? "Updating..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <BellRing className="mr-2 h-4 w-4" />
                      {selectedNotification ? "Update Announcement" : "Send Announcement"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg mt-6">
              <CardHeader className="bg-slate-100/50 dark:bg-slate-800/10 rounded-t-lg border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BellRing className="h-5 w-5" />
                      Recent Notifications
                    </CardTitle>
                    <CardDescription className="mt-1">
                      View the most recent notifications sent to your team or Teachers
                    </CardDescription>
                  </div>
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
                        value={notificationSearchTerm}
                        onChange={(e) => setNotificationSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setNotificationSearchTerm("")
                          setPriorityFilter("all")
                        }}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                {isFetching ? (
                  <div className="flex justify-center items-center py-12">
                    <Spinner className="h-6 w-6 text-black dark:text-slate-500" />
                    <p className="ml-2 text-muted-foreground animate-pulse">Fetching notifications...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Title</TableHead>
                          <TableHead className="w-[350px]">Message</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredNotifications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                              No notifications found. Try adjusting your search or filters.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredNotifications.map((notification) => (
                            <TableRow key={notification._id}>
                              <TableCell className="font-medium">{notification.title}</TableCell>
                              <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                {notification.message.length > 100
                                  ? `${notification.message.substring(0, 100)}...`
                                  : notification.message}
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-slate-500">
                                {new Date(notification.createdAt).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => editNotification(notification)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => deleteNotification(notification._id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Toaster />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}