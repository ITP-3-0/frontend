"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PencilIcon, TrashIcon, LaptopIcon, PlusIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TicketList({ tickets }) {
    const router = useRouter()
    const { toast } = useToast()
    const [ticketList, setTicketList] = useState(tickets) // Store tickets locally
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [ticketToDelete, setTicketToDelete] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedPriority, setSelectedPriority] = useState("all")

    const handleEdit = (id) => {
        router.push(`/tickets/${id}/edit`)
    }

    const handleDelete = async () => {
        if (!ticketToDelete) return

        setIsLoading(true) // Start loading
        try {
            const response = await fetch(`http://localhost:5000/tickets/${ticketToDelete}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete ticket")
            }

            // Remove the deleted ticket from state (instead of refreshing page)
            setTicketList(ticketList.filter((ticket) => ticket._id !== ticketToDelete))

            // Show success toast
            toast({
                title: "Success",
                description: "Ticket deleted successfully",
                variant: "success",
            })
        } catch (error) {
            console.error("Error deleting ticket:", error)
            toast({
                title: "Error",
                description: "Failed to delete ticket",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setTicketToDelete(null)
        }
    }

    const openDeleteDialog = (id) => {
        setTicketToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "low":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Low
                    </Badge>
                )
            case "medium":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Medium
                    </Badge>
                )
            case "high":
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        High
                    </Badge>
                )
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    const handlePriorityChange = (priority) => {
        setSelectedPriority(priority)
    }

    // Filter tickets based on search query and selected priority
    const filteredTickets = ticketList.filter((ticket) => {
        const matchesSearchQuery =
            ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (ticket.agentName && ticket.agentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (ticket.deviceName && ticket.deviceName.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesPriority = selectedPriority === "all" || ticket.priority === selectedPriority

        return matchesSearchQuery && matchesPriority
    })

    return (
        <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
                        <p className="text-muted-foreground mt-1">View and manage support tickets</p>
                    </div>
                    <Button onClick={() => router.push("/tickets/create")} className="shrink-0">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Ticket
                    </Button>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search tickets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="w-full sm:w-[180px]">
                                <Select defaultValue="all" onValueChange={handlePriorityChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ticket List */}
                <Card>
                    <CardContent className="p-0">
                        <div className="rounded-md overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden md:table-cell font-bold">Title</TableHead>
                                        <TableHead className="hidden md:table-cell font-bold">Description</TableHead>
                                        <TableHead className="hidden lg:table-cell font-bold">Device</TableHead>
                                        <TableHead className="hidden lg:table-cell font-bold">Distribution Date</TableHead>
                                        <TableHead className="hidden lg:table-cell font-bold">Warranty Period (Months)</TableHead>
                                        <TableHead className="hidden lg:table-cell font-bold">With/Without Warranty</TableHead>
                                        <TableHead className="hidden md:table-cell font-bold">Agent</TableHead>
                                        <TableHead className="hidden md:table-cell font-bold">Priority</TableHead>
                                        <TableHead className="text-right font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTickets.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                                <div className="flex flex-col items-center">
                                                    <LaptopIcon className="h-10 w-10 mb-2 text-muted-foreground/60" />
                                                    <p>No tickets found</p>
                                                    {searchQuery && <p className="text-sm mt-1">Try adjusting your search criteria</p>}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredTickets.map((ticket) => (
                                            <TableRow key={ticket._id} className="group">
                                                <TableCell className="font-medium">{ticket.title}</TableCell>
                                                <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                                                    {ticket.description}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">{ticket.deviceName || "N/A"}</TableCell>
                                                <TableCell className="hidden lg:table-cell text-center">
                                                    {new Date(ticket.distributionDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell max-w-[200px] truncate text-center">
                                                    {ticket.warrantyPeriod}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {(() => {
                                                        const currentDate = new Date();
                                                        const distributionDate = new Date(ticket.distributionDate);

                                                        const warrantyPeriod = new Date(ticket.warrantyPeriod);

                                                        const expirationDate = new Date(distributionDate);
                                                        expirationDate.setMonth(expirationDate.getMonth() + warrantyPeriod.getMonth());

                                                        if (currentDate > expirationDate) {
                                                            return "Warranty Expired";
                                                        } else {
                                                            return "With Warranty";
                                                        }
                                                    })()}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{ticket.agentName || "N/A"}</TableCell>
                                                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(ticket._id)}
                                                            className="h-8 w-8 opacity-70 group-hover:opacity-100"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={isLoading}
                                                            onClick={() => openDeleteDialog(ticket._id)}
                                                            className="h-8 w-8 text-destructive opacity-70 group-hover:opacity-100"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the ticket.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

