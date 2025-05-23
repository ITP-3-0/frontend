"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    PencilIcon,
    TrashIcon,
    LaptopIcon,
    PlusIcon,
    SearchIcon,
    FilterIcon,
    EyeIcon,
    CalendarIcon,
    ClockIcon,
    UserIcon,
    TagIcon,
    CheckCircleIcon,
    XCircleIcon,
    FileTextIcon,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import ReplyForm from "../replies/ReplyForm";
import ReplyList from "../replies/ReplyList";
import { generatePdfReport } from "@/utils/reportGenerator";

export default function TicketList({ tickets, isAgentView = false }) {
    const router = useRouter();
    const { toast } = useToast();
    const [ticketList, setTicketList] = useState(tickets);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [showReplyForm, setShowReplyForm] = useState(false);

    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handleEdit = (id, status) => {
        if (status === "in_progress" || status === "resolved") {
            toast({
                title: "Cannot edit ticket",
                description: `Tickets with '${status}' status cannot be edited.`,
                variant: "destructive",
            });
            return;
        }
        router.push(`/tickets/${id}/edit`);
    };

    const handleDelete = async () => {
        if (!ticketToDelete) return;

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/tickets/${ticketToDelete}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete ticket");
            }

            setTicketList(ticketList.filter((ticket) => ticket._id !== ticketToDelete));

            toast({
                title: "Success",
                description: "Ticket deleted successfully",
                variant: "success",
            });
        } catch (error) {
            console.error("Error deleting ticket:", error);
            toast({
                title: "Error",
                description: "Failed to delete ticket",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
            setIsDeleteDialogOpen(false);
            setTicketToDelete(null);
        }
    };

    const openDeleteDialog = (id, status) => {
        if (status === "in_progress" || status === "resolved") {
            toast({
                title: "Cannot delete ticket",
                description: `Tickets with '${status}' status cannot be deleted.`,
                variant: "destructive",
            });
            return;
        }
        setTicketToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleSortChange = (value) => {
        setSortOption(value); // Update the selected sort option
    };

    const handleView = (ticket) => {
        setSelectedTicket(ticket);
        setIsViewModalOpen(true);
        // Removed setShowReplyForm(true) to disable reply functionality
    };

    const handleReplyAdded = (updatedTicket) => {
        setTicketList(ticketList.map((t) => (t._id === updatedTicket._id ? updatedTicket : t)));
        setSelectedTicket(updatedTicket);
    };

    // Calculate warranty status
    const getWarrantyStatus = (ticket) => {
        try {
            const currentDate = new Date();
            const distributionDate = new Date(ticket.distributionDate);

            let warrantyMonths = 0;
            if (typeof ticket.warrantyPeriod === "number") {
                warrantyMonths = ticket.warrantyPeriod;
            } else if (typeof ticket.warrantyPeriod === "string") {
                const match = ticket.warrantyPeriod.match(/\d+/);
                if (match) {
                    warrantyMonths = Number.parseInt(match[0], 10);
                }
            }

            const expirationDate = new Date(distributionDate);
            expirationDate.setMonth(expirationDate.getMonth() + warrantyMonths);

            const isActive = currentDate <= expirationDate;

            // Calculate days remaining or days expired
            const diffTime = Math.abs(expirationDate - currentDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                isActive,
                diffDays,
                expirationDate,
            };
        } catch (error) {
            return { isActive: false, diffDays: 0, expirationDate: new Date() };
        }
    };

    // Sort tickets based on the selected sort option
    const sortTickets = (ticketsToSort) => {
        return [...ticketsToSort].sort((a, b) => {
            switch (sortOption) {
                case "newest":
                    // Use creation date for sorting, with proper fallback logic
                    const dateA_newest = new Date(a.createdAt || a.distributionDate || 0);
                    const dateB_newest = new Date(b.createdAt || b.distributionDate || 0);
                    return dateB_newest - dateA_newest; // Newest first (descending)
                case "oldest":
                    // Use creation date for sorting, with proper fallback logic
                    const dateA_oldest = new Date(a.createdAt || a.distributionDate || 0);
                    const dateB_oldest = new Date(b.createdAt || b.distributionDate || 0);
                    return dateA_oldest - dateB_oldest; // Oldest first (ascending)
                case "title":
                    return a.title.localeCompare(b.title);
                case "warranty":
                    const statusA = getWarrantyStatus(a);
                    const statusB = getWarrantyStatus(b);
                    if (statusA.isActive === statusB.isActive) {
                        return statusA.diffDays - statusB.diffDays;
                    }
                    return statusA.isActive ? -1 : 1;
                case "time":
                    const timeA = new Date(a.createdAt || a.distributionDate || 0).getTime();
                    const timeB = new Date(b.createdAt || b.distributionDate || 0).getTime();
                    // Sort by time (decending)
                    return timeB - timeA;
                default:
                    return 0;
            }
        });
    };

    // Filter tickets based on search query and active tab
    const filteredAndSortedTickets = sortTickets(
        ticketList.filter((ticket) => {
            const matchesSearchQuery =
                ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ticket.deviceName && ticket.deviceName.toLowerCase().includes(searchQuery.toLowerCase()));

            // Filter by warranty status if tab is not "all"
            if (activeTab !== "all") {
                const status = getWarrantyStatus(ticket);
                if (activeTab === "active" && !status.isActive) return false;
                if (activeTab === "expired" && status.isActive) return false;
            }

            return matchesSearchQuery;
        })
    );

    // Paginate the filtered and sorted tickets
    const paginatedTickets = filteredAndSortedTickets.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Count tickets by warranty status
    const activeTicketsCount = ticketList.filter((ticket) => getWarrantyStatus(ticket).isActive).length;
    const expiredTicketsCount = ticketList.length - activeTicketsCount;

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col gap-8">
                {/* Header with animated gradient background */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-8 text-white shadow-lg">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=1000')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
                            <p className="mt-1 opacity-90">View and manage support tickets</p>
                        </div>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => router.push("/tickets/create")}
                                        className="shrink-0 bg-white text-purple-700 hover:bg-white/90 transition-all shadow-md hover:shadow-lg"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Add Ticket
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Create a new support ticket</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="overflow-hidden border-none shadow-md">
                        <CardContent className="p-0">
                            <div className="flex items-center">
                                <div className="p-4 flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                                    <p className="text-3xl font-bold">{ticketList.length}</p>
                                </div>
                                <div className="h-full w-2 bg-gradient-to-b from-purple-500 to-violet-600"></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-none shadow-md">
                        <CardContent className="p-0">
                            <div className="flex items-center">
                                <div className="p-4 flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Active Warranty</p>
                                    <p className="text-3xl font-bold text-emerald-600">{activeTicketsCount}</p>
                                </div>
                                <div className="h-full w-2 bg-gradient-to-b from-emerald-500 to-green-600"></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-none shadow-md">
                        <CardContent className="p-0">
                            <div className="flex items-center">
                                <div className="p-4 flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">Expired Warranty</p>
                                    <p className="text-3xl font-bold text-rose-600">{expiredTicketsCount}</p>
                                </div>
                                <div className="h-full w-2 bg-gradient-to-b from-rose-500 to-red-600"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs and Filters */}
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                        <TabsList className="bg-muted/50">
                            <TabsTrigger value="all" className="data-[state=active]:bg-background">
                                All Tickets
                            </TabsTrigger>
                            <TabsTrigger value="active" className="data-[state=active]:bg-background">
                                Active Warranty
                            </TabsTrigger>
                            <TabsTrigger value="expired" className="data-[state=active]:bg-background">
                                Expired Warranty
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-[280px]">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tickets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 w-full"
                                />
                            </div>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
                                            onClick={() => generatePdfReport(filteredAndSortedTickets, getWarrantyStatus)}
                                        >
                                            <FileTextIcon className="h-4 w-4 mr-2" />
                                            Generate Report
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Generate a report of all ticket information</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        <FilterIcon className="h-4 w-4 mr-2" />
                                        Sort
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleSortChange("newest")}
                                        className={`flex items-center justify-between ${sortOption === "newest" ? "bg-muted font-bold" : ""}`}
                                    >
                                        Newest First
                                        {sortOption === "newest" && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleSortChange("oldest")}
                                        className={`flex items-center justify-between ${sortOption === "oldest" ? "bg-muted font-bold" : ""}`}
                                    >
                                        Oldest First
                                        {sortOption === "oldest" && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleSortChange("time")}
                                        className={`flex items-center justify-between ${sortOption === "time" ? "bg-muted font-bold" : ""}`}
                                    >
                                        Time Created
                                        {sortOption === "time" && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleSortChange("title")}
                                        className={`flex items-center justify-between ${sortOption === "title" ? "bg-muted font-bold" : ""}`}
                                    >
                                        Title (A-Z)
                                        {sortOption === "title" && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleSortChange("warranty")}
                                        className={`flex items-center justify-between ${sortOption === "warranty" ? "bg-muted font-bold" : ""}`}
                                    >
                                        Warranty Status
                                        {sortOption === "warranty" && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <TabsContent value="all" className="mt-0">
                        <TicketTable
                            tickets={paginatedTickets}
                            handleEdit={handleEdit}
                            openDeleteDialog={openDeleteDialog}
                            handleView={handleView}
                            isLoading={isLoading}
                            getWarrantyStatus={getWarrantyStatus}
                            searchQuery={searchQuery}
                        />
                    </TabsContent>

                    <TabsContent value="active" className="mt-0">
                        <TicketTable
                            tickets={paginatedTickets}
                            handleEdit={handleEdit}
                            openDeleteDialog={openDeleteDialog}
                            handleView={handleView}
                            isLoading={isLoading}
                            getWarrantyStatus={getWarrantyStatus}
                            searchQuery={searchQuery}
                        />
                    </TabsContent>

                    <TabsContent value="expired" className="mt-0">
                        <TicketTable
                            tickets={paginatedTickets}
                            handleEdit={handleEdit}
                            openDeleteDialog={openDeleteDialog}
                            handleView={handleView}
                            isLoading={isLoading}
                            getWarrantyStatus={getWarrantyStatus}
                            searchQuery={searchQuery}
                        />
                    </TabsContent>
                </Tabs>

                {/* Rows Per Page and Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
                        <Select defaultValue={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="Rows" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                            Showing {Math.min(filteredAndSortedTickets.length, (currentPage - 1) * rowsPerPage + 1)}-
                            {Math.min(filteredAndSortedTickets.length, currentPage * rowsPerPage)} of {filteredAndSortedTickets.length}
                        </span>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredAndSortedTickets.length}
                        itemsPerPage={rowsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the ticket.</AlertDialogDescription>
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

            {/* View Ticket Details Dialog */}
            {selectedTicket && (
                <AlertDialog
                    open={isViewModalOpen}
                    onOpenChange={(open) => {
                        setIsViewModalOpen(open);
                        if (!open) setSelectedTicket(null);
                        // Removed the showReplyForm reset
                    }}
                >
                    <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">{selectedTicket.title}</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">{selectedTicket.description}</AlertDialogDescription>
                        </AlertDialogHeader>

                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted p-2 rounded-full">
                                            <LaptopIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Device</p>
                                            <p className="text-sm text-muted-foreground">{selectedTicket.deviceName || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted p-2 rounded-full">
                                            <TagIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Priority</p>
                                            <Badge
                                                variant={
                                                    selectedTicket.priority === "high"
                                                        ? "destructive"
                                                        : selectedTicket.priority === "medium"
                                                        ? "warning"
                                                        : "default"
                                                }
                                            >
                                                {selectedTicket.priority}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted p-2 rounded-full">
                                            <TagIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Status</p>
                                            <Badge
                                                variant={
                                                    selectedTicket.status === "resolved"
                                                        ? "success"
                                                        : selectedTicket.status === "in_progress"
                                                        ? "warning"
                                                        : "default"
                                                }
                                            >
                                                {selectedTicket.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted p-2 rounded-full">
                                            <TagIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Warranty Status</p>
                                            <div className="mt-1">
                                                {(() => {
                                                    const status = getWarrantyStatus(selectedTicket);
                                                    if (status.isActive) {
                                                        return (
                                                            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                                                Active - {status.diffDays} days remaining
                                                            </Badge>
                                                        );
                                                    } else {
                                                        return (
                                                            <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                                                                Expired - {status.diffDays} days ago
                                                            </Badge>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <p className="text-sm font-medium mb-2">Description</p>
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-3">
                                            <p className="text-sm">{selectedTicket.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Display all replies */}
                                <div className="border rounded-md p-4 bg-muted/30 mt-4">
                                    <h3 className="text-sm font-semibold mb-3">Agent Replies({selectedTicket.replies?.length || 0})</h3>

                                    <ScrollArea className="h-[200px]">
                                        <div className="flex flex-col gap-3">
                                            {selectedTicket.replies?.map((reply, index) => (
                                                <div key={reply._id || index} className="bg-white border rounded-md p-3 shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="bg-blue-100 rounded-full p-1">
                                                                <UserIcon className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <span className="font-medium">{reply.agentName || "Agent"}</span>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(reply.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mb-2">{reply.message}</p>
                                                    {reply.content && (
                                                        <div className="bg-blue-50 p-3 rounded border border-blue-200 overflow-x-auto">
                                                            <pre className="text-xs whitespace-pre-wrap text-blue-900">{reply.content}</pre>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* If no replies */}
                                            {(!selectedTicket.replies || selectedTicket.replies.length === 0) && (
                                                <div className="text-center p-4 text-muted-foreground text-sm">No replies for this ticket yet.</div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </ScrollArea>

                        <AlertDialogFooter className="gap-2 sm:gap-0">
                            <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}

// Extracted TicketTable component for better organization
function TicketTable({ tickets, handleEdit, openDeleteDialog, handleView, isLoading, getWarrantyStatus, searchQuery }) {
    return (
        <Card className="overflow-hidden border-none shadow-md">
            <CardContent className="p-0">
                <div className="rounded-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference ID</TableHead>
                                <TableHead className="hidden md:table-cell">Title</TableHead>
                                <TableHead className="hidden md:table-cell">Description</TableHead>
                                <TableHead className="hidden lg:table-cell">Device</TableHead>
                                <TableHead className="hidden lg:table-cell">Distribution Date</TableHead>
                                <TableHead className="hidden lg:table-cell">Warranty</TableHead>
                                <TableHead className="text-right">Ticket Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                                        <div className="flex flex-col items-center">
                                            <div className="rounded-full bg-muted p-3 mb-2">
                                                <LaptopIcon className="h-6 w-6 text-muted-foreground/60" />
                                            </div>
                                            <p className="font-medium">No tickets found</p>
                                            {searchQuery && <p className="text-sm mt-1">Try adjusting your search criteria</p>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.map((ticket, index) => {
                                    const warrantyStatus = getWarrantyStatus(ticket);

                                    return (
                                        <TableRow key={ticket._id} className="group transition-colors hover:bg-muted/30">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${warrantyStatus.isActive ? "bg-green-500" : "bg-red-500"}`}
                                                    ></div>
                                                    {ticket._id.slice(0, 7)} {/* Show only the first 7 characters */}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell max-w-[200px] truncate">{ticket.title}</TableCell>
                                            <TableCell className="hidden md:table-cell max-w-[200px] truncate">{ticket.description}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{ticket.deviceName || "N/A"}</TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                {new Date(ticket.distributionDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                {(() => {
                                                    if (warrantyStatus.isActive) {
                                                        return (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-green-50 text-green-800 border-green-200 flex items-center gap-1"
                                                            >
                                                                <CheckCircleIcon className="h-3 w-3" />
                                                                <span>{warrantyStatus.diffDays} days left</span>
                                                            </Badge>
                                                        );
                                                    } else {
                                                        return (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-red-50 text-red-800 border-red-200 flex items-center gap-1"
                                                            >
                                                                <XCircleIcon className="h-3 w-3" />
                                                                <span>Expired</span>
                                                            </Badge>
                                                        );
                                                    }
                                                })()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={
                                                        ticket.status === "resolved"
                                                            ? "success"
                                                            : ticket.status === "in_progress"
                                                            ? "warning"
                                                            : "default"
                                                    }
                                                >
                                                    {ticket.status || "open"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleView(ticket)}
                                                                    className="h-8 w-8 opacity-70 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <EyeIcon className="h-4 w-4" />
                                                                    <span className="sr-only">View</span>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>View details</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleEdit(ticket._id, ticket.status)}
                                                                    className="h-8 w-8 opacity-70 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <PencilIcon className="h-4 w-4" />
                                                                    <span className="sr-only">Edit</span>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {ticket.status === "in_progress" || ticket.status === "resolved"
                                                                    ? `Cannot edit ${ticket.status} ticket`
                                                                    : "Edit ticket"}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={isLoading}
                                                                    onClick={() => openDeleteDialog(ticket._id, ticket.status)}
                                                                    className="h-8 w-8 text-destructive opacity-70 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                    <span className="sr-only">Delete</span>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {ticket.status === "in_progress" || ticket.status === "resolved"
                                                                    ? `Cannot delete ${ticket.status} ticket`
                                                                    : "Delete ticket"}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
