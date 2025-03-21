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
        try {
            registerAdmin(newUser.email, newUser.password, newUser.username, newUser.role, newUser.censusNo);
        } catch (error) {
            window.alert("An error occurred. Error: " + error.message);
        } finally {
            setShowAddUserDialog(false);
        }
    };

    const handleEditUser = (updatedUser) => {
        // In a real app, you would make an API call here
        const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
        setUsers(updatedUsers);
        setShowEditUserDialog(false);
    };

    const handleDeleteUser = (userId) => {
        // In a real app, you would make an API call here
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
    };

    const handleFileUpload = (fileData) => {
        console.log("File data received:", fileData);
        setShowFileUploader(false);
        // For testing
        alert(`Successfully processed file with ${fileData.length} records`);
    };

    // User stats
    const userStats = {
        total: users.length,
        admins: users.filter((user) => user.role === "admin").length,
        users: users.filter((user) => user.role === "client").length,
        agent: users.filter((user) => user.role === "agent_l1").length,
        agent: users.filter((user) => user.role === "agent_l2").length,
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
                                                    onClick={() => handleDeleteUser(user.id)}
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
