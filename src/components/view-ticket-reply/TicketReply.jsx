"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, AlertCircle, CheckCircle, Loader2, Clock, RefreshCw } from "lucide-react";

export default function TicketReply() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState("");
    const [filteredReplies, setFilteredReplies] = useState([]);
    const [agentReplies, setAgentReplies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch all tickets
        const fetchTickets = async () => {
            try {
                // Use the correct API endpoint - adjust based on your backend setup
                const response = await fetch("/api/tickets");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTickets(data.tickets || []);
            } catch (error) {
                console.error("Error fetching tickets:", error.message);
                setError("Failed to load tickets. Please try again later.");
            }
        };

        fetchTickets();
    }, []);

    useEffect(() => {
        // Fetch replies for the selected ticket ID
        const fetchRepliesForTicket = async () => {
            if (!selectedTicketId) {
                setFilteredReplies([]);
                setAgentReplies([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Using the correct endpoint with base URL
                const response = await fetch(`/api/tickets/${selectedTicketId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Check if the ticket data contains replies
                if (data.ticket && Array.isArray(data.ticket.replies)) {
                    // Filter out only agent replies
                    const onlyAgentReplies = data.ticket.replies.filter(
                        (reply) => reply.agentName && reply.agentName !== "undefined" && reply.agentName !== "null"
                    );

                    setFilteredReplies(data.ticket.replies);
                    setAgentReplies(onlyAgentReplies);
                } else {
                    console.log("No replies found in the ticket data:", data);
                    setFilteredReplies([]);
                    setAgentReplies([]);
                }
            } catch (error) {
                console.error("Error fetching replies:", error.message);
                setError(`Failed to load replies: ${error.message}`);
                setFilteredReplies([]);
                setAgentReplies([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRepliesForTicket();
    }, [selectedTicketId]);

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-5xl">
            <Card className="border-none shadow-lg bg-gradient-to-r from-slate-50 to-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <MessageCircle className="h-6 w-6 text-primary" />
                        Ticket Replies
                    </CardTitle>
                    <CardDescription>View agent responses to your support tickets</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Ticket ID Selector */}
                    <div className="mb-6 space-y-2">
                        <label className="block text-sm font-medium mb-2">Select Your Ticket ID</label>
                        <Select onValueChange={(value) => setSelectedTicketId(value)}>
                            <SelectTrigger className="w-full bg-white shadow-sm focus:ring-2 focus:ring-primary">
                                <SelectValue placeholder="Select Ticket ID" />
                            </SelectTrigger>
                            <SelectContent>
                                {tickets.map((ticket) => (
                                    <SelectItem key={ticket._id} value={ticket._id}>
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-medium">ID: {ticket._id.substring(0, 8)}...</span>
                                            <span className="truncate text-sm text-slate-500 ml-2">
                                                {ticket.title?.substring(0, 20) || "No Title"}
                                                {ticket.title?.length > 20 ? "..." : ""}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Error message display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-red-50 text-red-700 p-4 rounded-md mb-4 border border-red-200 flex gap-2"
                            >
                                <AlertCircle className="h-5 w-5" />
                                <div>
                                    <p className="font-semibold">Error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading indicator */}
                    <AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-center p-6 flex flex-col items-center"
                            >
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="mt-3 text-sm text-gray-500">Loading your ticket replies...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat View */}
                    <AnimatePresence>
                        {selectedTicketId && !isLoading && !error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="border border-slate-200 shadow-sm">
                                    <CardHeader className="bg-slate-50 flex flex-row justify-between items-center pb-3">
                                        <div>
                                            <CardTitle className="text-lg">Ticket Conversation</CardTitle>
                                            <CardDescription className="text-xs mt-1">ID: {selectedTicketId}</CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedTicketId("")}
                                            className="text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors"
                                        >
                                            Close
                                        </Button>
                                    </CardHeader>

                                    <CardContent className="pt-4 pb-0">
                                        {filteredReplies.length === 0 ? (
                                            <div className="text-center py-8 text-slate-500">
                                                <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                                <p>No replies yet. Please check back later.</p>
                                            </div>
                                        ) : (
                                            <ScrollArea className="max-h-96 pr-4">
                                                {/* Agent Replies Section */}
                                                {agentReplies.length > 0 && (
                                                    <div className="mb-6">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="bg-primary/10 p-1.5 rounded-full">
                                                                <MessageCircle className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <h3 className="text-sm font-semibold text-primary">Agent Responses</h3>
                                                        </div>
                                                        <div className="space-y-4">
                                                            {agentReplies.map((reply, index) => (
                                                                <motion.div
                                                                    key={reply._id}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                                    className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm"
                                                                >
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                                                <span className="text-xs font-semibold text-primary">
                                                                                    {reply.agentName?.charAt(0) || "A"}
                                                                                </span>
                                                                            </div>
                                                                            <span className="font-medium text-sm text-slate-900">
                                                                                {reply.agentName || "Agent"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            {reply.status && (
                                                                                <Badge
                                                                                    variant={reply.status === "resolved" ? "success" : "outline"}
                                                                                    className="mr-2"
                                                                                >
                                                                                    {reply.status === "resolved" ? (
                                                                                        <span className="flex items-center gap-1">
                                                                                            <CheckCircle className="h-3 w-3" /> Resolved
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="flex items-center gap-1">
                                                                                            <RefreshCw className="h-3 w-3" /> In Progress
                                                                                        </span>
                                                                                    )}
                                                                                </Badge>
                                                                            )}
                                                                            <span className="text-xs text-slate-400">
                                                                                {new Date(reply.createdAt).toLocaleString("en-US", {
                                                                                    month: "short",
                                                                                    day: "numeric",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                })}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <Separator className="my-2" />
                                                                    <p className="text-sm text-slate-700 whitespace-pre-line">{reply.content}</p>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </ScrollArea>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-2 pb-4">
                                        <div className="text-xs text-slate-400 w-full text-center">
                                            End of replies • Please submit a new ticket for additional help
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}
