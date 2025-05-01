"use client";

import { useState, useEffect } from "react";
import { Download, Upload, Search, UserPlus, Filter, RefreshCw, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileUploader } from "./FileUploader";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { registerAdmin } from "@/Firebase/FirebaseFunctions";
import { useButton } from "@/app/Contexts/ButtonContext";
import { toast } from "sonner";

export function UserManagement({ props }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [showEditUserDialog, setShowEditUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showFileUploader, setShowFileUploader] = useState(false);
    const [roleFilter, setRoleFilter] = useState("all");
    const { button, setButton } = useButton();
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await fetch("/api/users");
                const fetchedUsers = await data.json();
                setUsers(fetchedUsers);
                setFilteredUsers(fetchedUsers);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;

        if (searchQuery) {
            result = result.filter((user) => {
                return (
                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.censusNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
        }

        if (roleFilter !== "all") {
            result = result.filter((user) => {
                if (roleFilter === "agent") {
                    return user.role === "agent_l1" || user.role === "agent_l2";
                } else {
                    return user.role === roleFilter;
                }
            });
        }

        setFilteredUsers(result);
    }, [searchQuery, roleFilter, users]);

    const handleAddUser = async (newUser) => {
        // need to send the data to the backend to process account creation
        try {
            const userData = {
                username: newUser.username,
                email: newUser.email,
                censusNo: newUser.censusNo ? newUser.censusNo : "", // Ensure censusNo is included
                role: newUser.role,
                password: newUser.password,
            };
            await fetch("/api/users/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to create user");
                    }
                    window.location.reload();
                    return response.json();
                })
                .then((data) => {
                    console.log("User created successfully:", data);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error creating user:", error);
                    window.alert("An error occurred. Error: " + error.message);
                    window.location.reload();
                });
        } catch (error) {
            window.alert("An error occurred. Error: " + error.message);
        } finally {
            setShowAddUserDialog(false);
        }
    };

    const handleEditUser = async (updatedUser) => {
        try {
            setButton(true);
            const userData = {
                _id: updatedUser.id,
                username: updatedUser.username,
                censusNo: updatedUser.censusNo, // Ensure censusNo is included
                role: updatedUser.role,
            };

            await fetch(`/api/users/${updatedUser.id}`, {
                // Await the fetch call
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            setShowEditUserDialog(false); // Close the dialog after saving
        } catch (error) {
            window.alert("An error occurred. Error: " + error.message);
        } finally {
            setButton(false);
        }
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            fetch(`/api/users/${userId}`, {
                method: "DELETE",
            })
                .catch((error) => {
                    window.alert("An error occurred. Error: " + error.message);
                })
                .finally(() => {
                    window.location.reload();
                });
        }
    };

    useEffect(() => {
        // this should be changed to government url
        const eventSource = new EventSource("http://localhost:5000/users/bulk-account-creation/stream");

        eventSource.addEventListener("finished", (e) => {
            toast.dismiss();
            toast("Bulk upload completed successfully.");

            eventSource.close();
            setTimeout(() => window.location.reload(), 3000);
        });

        eventSource.addEventListener("error", (e) => {
            toast.dismiss();
            toast("An error occurred during bulk upload. Please try again.", {
                variant: "destructive",
            });
            eventSource.close();
            setTimeout(() => window.location.reload(), 3000);
        });

        return () => {
            eventSource.close();
        };
    }, []);

    const handleFileUpload = (file) => {
        fetch("/api/users/bulk-account-creation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ file }),
        })
            .then(() => {
                toast("Bulk upload started. Please wait...", {
                    duration: Infinity,
                });
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
                window.alert("An error occurred. Error: " + error.message);
                window.location.reload();
            });
    };

    const userStats = {
        total: users.length,
        admins: users.filter((user) => user.role === "admin").length,
        users: users.filter((user) => user.role === "client").length,
        agent: users.filter((user) => user.role === "agent_l1" || user.role === "agent_l2").length,
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Admins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.admins}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Agents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.agent}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.users}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users..."
                            className="pl-8 w-full md:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("admin")}>Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("agent")}>Agent</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("client")}>User</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9"
                        onClick={() => {
                            setSearchQuery("");
                            setRoleFilter("all");
                        }}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="h-9" onClick={() => setShowFileUploader(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <Button variant="outline" size="sm" className="h-9">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button size="sm" className="h-9" onClick={() => setShowAddUserDialog(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User Name</TableHead>
                            <TableHead>Census Number</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    No users found. Try adjusting your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.censusNo}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "admin" ? "destructive" : user.role === "client" ? "secondary" : "default"}>
                                            {user.role === "admin"
                                                ? "Admin"
                                                : user.role === "client"
                                                ? "User"
                                                : user.role === "agent_l1"
                                                ? "Agent L1"
                                                : "Agent L2"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowEditUserDialog(true);
                                                    }}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                >
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

            {showFileUploader && <FileUploader onClose={() => setShowFileUploader(false)} onUpload={handleFileUpload} />}

            {showAddUserDialog && <AddUserDialog onClose={() => setShowAddUserDialog(false)} onSave={handleAddUser} />}

            {showEditUserDialog && selectedUser && (
                <EditUserDialog user={selectedUser} onClose={() => setShowEditUserDialog(false)} onSave={handleEditUser} />
            )}
        </div>
    );
}
