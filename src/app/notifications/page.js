"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Mail, BellRing, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Notifications() {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [serverStatus, setServerStatus] = useState("");
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isCheckingServer, setIsCheckingServer] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "alert",
        priority: "medium",
        targetUsers: [],
        targetRoles: [],
        isEmailable: false,
    });

    // Available roles
    const availableRoles = ["client", "agent_l1", "agent_l2", "admin"];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = type === "checkbox" ? e.target.checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const toggleUserSelection = (username) => {
        setFormData((prev) => {
            const isSelected = prev.targetUsers.includes(username);
            return {
                ...prev,
                targetUsers: isSelected ? prev.targetUsers.filter((u) => u !== username) : [...prev.targetUsers, username],
            };
        });
    };

    const toggleRoleSelection = (role) => {
        setFormData((prev) => {
            const isSelected = prev.targetRoles.includes(role);
            return {
                ...prev,
                targetRoles: isSelected ? prev.targetRoles.filter((r) => r !== role) : [...prev.targetRoles, role],
            };
        });
    };

    const fetchNotifications = async () => {
        setIsFetching(true);
        try {
            const response = await fetch("/api/notifications");
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const addNotification = async () => {
        if (!formData.title.trim() || !formData.message.trim()) {
            toast({
                title: "Error",
                description: "Title and message are required",
                variant: "destructive",
            });
            return;
        }

        if (formData.targetRoles.length === 0 && formData.targetUsers.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one target role or user",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Notification sent successfully!",
                    variant: "default",
                });
                setFormData({
                    title: "",
                    message: "",
                    type: "system",
                    priority: "medium",
                    targetUsers: [],
                    targetRoles: [],
                    isEmailable: false,
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to send notification",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error adding notification:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const checkServerStatus = async () => {
        setIsCheckingServer(true);
        try {
            const response = await fetch("/api");
            if (response.ok) {
                setServerStatus("Server is up and running!");
            } else {
                setServerStatus("Server is down.");
            }
        } catch (error) {
            console.error("Error checking server status:", error);
            setServerStatus("Error checking server status.");
        } finally {
            setIsCheckingServer(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col items-center justify-center p-6">
            <Card className="w-full max-w-2xl shadow-xl border-0">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <BellRing className="w-6 h-6" /> Send Announcement
                    </h1>
                </div>

                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter announcement title"
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Enter your message here"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="mt-1"
                                disabled={isLoading}
                            />
                        </div>

                        <Tabs defaultValue="roles">
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="roles" disabled={isLoading}>
                                    Target Roles
                                </TabsTrigger>
                                <TabsTrigger value="users" disabled={isLoading}>
                                    Target Users
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="roles" className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                    {availableRoles.map((role) => (
                                        <Badge
                                            key={role}
                                            variant={formData.targetRoles.includes(role) ? "default" : "outline"}
                                            className={`cursor-pointer py-2 px-3 text-sm ${
                                                formData.targetRoles.includes(role) ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-100"
                                            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={() => !isLoading && toggleRoleSelection(role)}
                                        >
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="users" className="mt-4">
                                <div className="mb-4 relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search users..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="border rounded-md max-h-60 overflow-y-auto">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <div
                                                key={user._id}
                                                className={`flex items-center p-2 hover:bg-slate-100 cursor-pointer ${
                                                    formData.targetUsers.includes(user.username) ? "bg-blue-50" : ""
                                                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                                onClick={() => !isLoading && toggleUserSelection(user.username)}
                                            >
                                                <Checkbox
                                                    checked={formData.targetUsers.includes(user.username)}
                                                    className="mr-2"
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

                        <div>
                            <Label className="mb-2 block">Priority</Label>
                            <div className="flex gap-2 flex-wrap">
                                {["low", "medium", "high", "urgent"].map((level) => (
                                    <Button
                                        key={level}
                                        type="button"
                                        variant={formData.priority === level ? "default" : "outline"}
                                        onClick={() => !isLoading && setFormData({ ...formData, priority: level })}
                                        className={formData.priority === level ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-slate-100"}
                                        size="sm"
                                        disabled={isLoading}
                                    >
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="isEmailable"
                                name="isEmailable"
                                checked={formData.isEmailable}
                                onCheckedChange={(checked) => setFormData({ ...formData, isEmailable: checked })}
                                disabled={isLoading}
                            />
                            <Label htmlFor="isEmailable" className={`cursor-pointer flex items-center gap-1 ${isLoading ? "opacity-50" : ""}`}>
                                <Mail className="w-4 h-4" /> Send as Email
                            </Label>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-sm text-slate-500">
                                {formData.targetRoles.length > 0 && (
                                    <div className="flex flex-wrap gap-1 items-center">
                                        <span>Roles:</span>
                                        {formData.targetRoles.map((role) => (
                                            <Badge key={role} variant="secondary" className="flex items-center gap-1">
                                                {role}
                                                {!isLoading && <X className="w-3 h-3 cursor-pointer" onClick={() => toggleRoleSelection(role)} />}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {formData.targetUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-1 items-center mt-1">
                                        <span>Users:</span>
                                        {formData.targetUsers.map((user) => (
                                            <Badge key={user} variant="secondary" className="flex items-center gap-1">
                                                {user}
                                                {!isLoading && <X className="w-3 h-3 cursor-pointer" onClick={() => toggleUserSelection(user)} />}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={addNotification}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Notification"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 flex flex-col items-center gap-2 w-full max-w-2xl">
                <div className="flex gap-2">
                    <Button onClick={fetchNotifications} className="bg-green-500 hover:bg-green-600 text-white" disabled={isFetching}>
                        {isFetching ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Fetching...
                            </>
                        ) : (
                            "Fetch Notifications"
                        )}
                    </Button>
                    <Button onClick={checkServerStatus} className="bg-blue-500 hover:bg-blue-600 text-white" disabled={isCheckingServer}>
                        {isCheckingServer ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Checking...
                            </>
                        ) : (
                            "Check Server Status"
                        )}
                    </Button>
                </div>

                {serverStatus && <div className="mt-2 p-2 bg-white rounded-lg shadow text-center w-full">Server Status: {serverStatus}</div>}

                {notifications.length > 0 && (
                    <div className="w-full mt-4">
                        <h2 className="text-lg font-medium mb-2">Recent Notifications</h2>
                        <div className="space-y-2">
                            {notifications.map((notification, index) => (
                                <Card key={index} className="p-3">
                                    <div className="font-medium">{notification.title}</div>
                                    <div className="text-sm text-slate-600 mt-1">{notification.message}</div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Toaster />
        </div>
    );
}