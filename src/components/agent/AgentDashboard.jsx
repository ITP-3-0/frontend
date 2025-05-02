'use client'
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, FilterIcon, FileTextIcon, Download } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import ReplyForm from '../replies/ReplyForm';
import ReplyList from '../replies/ReplyList';
import { generateTicketReport } from '@/utils/pdfGenerator';

export default function AgentDashboard() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const { toast } = useToast();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await fetch('/api/tickets');
            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }
            const data = await response.json();
            setTickets(data.tickets);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const getTicketCount = (status) => {
        return tickets.filter(ticket => ticket.status === status).length;
    };

    const handleReplyAdded = (updatedTicket) => {
        setTickets(tickets.map(t => 
            t._id === updatedTicket._id ? updatedTicket : t
        ));
        setSelectedTicket(updatedTicket);
    };

    const generateReport = async () => {
        try {
            if (!tickets || tickets.length === 0) {
                toast({
                    title: "Error",
                    description: "No tickets available to generate report",
                    variant: "destructive",
                });
                return;
            }

            const doc = generateTicketReport(tickets);
            const fileName = `helpdesk-report-${new Date().toISOString().slice(0,10)}.pdf`;
            doc.save(fileName);
            
            toast({
                title: "Success",
                description: "Report downloaded successfully",
                variant: "default",
            });
        } catch (error) {
            console.error('Report generation error:', error);
            toast({
                title: "Error",
                description: "Failed to generate report. Please try again.",
                variant: "destructive",
            });
        }
    };

    const filteredTickets = tickets
        .filter(ticket => {
            if (activeTab !== "all" && ticket.status !== activeTab) return false;
            if (!searchQuery) return true;
            return (
                ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.creator.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.created_at) - new Date(a.created_at);
                case "oldest":
                    return new Date(a.created_at) - new Date(b.created_at);
                case "priority":
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                default:
                    return 0;
            }
        });

    return (
        <div className="container mx-auto py-8 px-4">
            <Toaster />
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Agent Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Open Tickets</p>
                                    <p className="text-2xl font-bold">{getTicketCount("open")}</p>
                                </div>
                                <Badge variant="default">New</Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">In Progress</p>
                                    <p className="text-2xl font-bold">{getTicketCount("in_progress")}</p>
                                </div>
                                <Badge variant="warning">Processing</Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Resolved</p>
                                    <p className="text-2xl font-bold">{getTicketCount("resolved")}</p>
                                </div>
                                <Badge variant="success">Completed</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <FilterIcon className="mr-2 h-4 w-4" />
                                Sort By
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSortBy("newest")}>
                                Newest First
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                                Oldest First
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("priority")}>
                                Priority
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={generateReport} variant="outline">
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        Generate Report
                    </Button>
                </div>

                {/* Tickets List */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Tickets</TabsTrigger>
                        <TabsTrigger value="open">Open</TabsTrigger>
                        <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab} className="mt-4">
                        <div className="grid gap-4">
                            {filteredTickets.map((ticket) => (
                                <Card key={ticket._id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{ticket.title}</CardTitle>
                                                <p className="text-sm text-gray-500">
                                                    Created by {ticket.creator} on {new Date(ticket.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge variant={
                                                ticket.priority === 'high' ? 'destructive' :
                                                ticket.priority === 'medium' ? 'warning' : 'default'
                                            }>
                                                {ticket.priority}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
                                        <div className="flex justify-between items-center">
                                            <Badge variant={
                                                ticket.status === 'resolved' ? 'success' :
                                                ticket.status === 'in_progress' ? 'warning' : 'default'
                                            }>
                                                {ticket.status}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                onClick={() => setSelectedTicket(ticket)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Ticket Details Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedTicket.title}</h2>
                                <p className="text-gray-600">{selectedTicket.description}</p>
                            </div>
                            <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
                                Close
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Device</p>
                                    <p>{selectedTicket.deviceName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Priority</p>
                                    <Badge variant={selectedTicket.priority === 'high' ? 'destructive' : 
                                        selectedTicket.priority === 'medium' ? 'warning' : 'default'}>
                                        {selectedTicket.priority}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <Badge variant={selectedTicket.status === 'resolved' ? 'success' : 
                                        selectedTicket.status === 'in_progress' ? 'warning' : 'default'}>
                                        {selectedTicket.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Created By</p>
                                    <p>{selectedTicket.creator}</p>
                                </div>
                            </div>

                            <Separator />

                            <h3 className="text-lg font-semibold">Replies</h3>
                            <ReplyList replies={selectedTicket.replies} />

                            <Separator />

                            <h3 className="text-lg font-semibold">Add Reply</h3>
                            <ReplyForm 
                                ticketId={selectedTicket._id} 
                                onReplyAdded={handleReplyAdded}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}