"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, X, Mail, BellRing, Loader2, Calendar, AlertTriangle, Clock } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/Firebase/AuthContext"
import { Spinner } from "@/components/ui/spinner"
import { addNotificationHandler } from "@/utils/notificationUtils"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

export default function Notifications() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [serverStatus, setServerStatus] = useState("")
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isCheckingServer, setIsCheckingServer] = useState(false)
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
  }, [])

  const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))

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

  const { user, loading } = useAuth()

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

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
                    Send Announcement
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Create and send announcements to your team or clients
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
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                onClick={addNotification}
                disabled={isLoading}
                className="transition-all bg-black dark:bg-slate-500 hover:bg-slate-700 dark:hover:bg-black"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <BellRing className="mr-2 h-4 w-4" />
                    Send Announcement
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          <Toaster />
        </div>
      </div>
    </div>
  )
}

