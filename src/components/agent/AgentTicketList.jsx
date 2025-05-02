import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import TicketList from "../ticket-raising/TicketList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AgentTicketList() {
    const [tickets, setTickets] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await fetch("/api/tickets");
            if (!response.ok) {
                throw new Error("Failed to fetch tickets");
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
        return tickets.filter((ticket) => ticket.status === status).length;
    };

    const filteredTickets = tickets.filter((ticket) => {
        if (activeTab === "all") return true;
        return ticket.status === activeTab;
    });

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Agent Dashboard</h1>
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

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Tickets</TabsTrigger>
                        <TabsTrigger value="open">Open</TabsTrigger>
                        <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab}>
                        <TicketList tickets={filteredTickets} isAgentView={true} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
