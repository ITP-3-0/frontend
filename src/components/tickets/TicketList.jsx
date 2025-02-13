"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TicketList({ tickets = [] }) {
    const [filter, setFilter] = useState("all");

    const filteredTickets = tickets.filter(ticket => {
        if (filter === "all") return true;
        return ticket.status === filter;
    });

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button 
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => setFilter("all")}
                >
                    All
                </Button>
                <Button 
                    variant={filter === "open" ? "default" : "outline"}
                    onClick={() => setFilter("open")}
                >
                    Open
                </Button>
                <Button 
                    variant={filter === "closed" ? "default" : "outline"}
                    onClick={() => setFilter("closed")}
                >
                    Closed
                </Button>
            </div>

            <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{ticket.title}</h3>
                                <p className="text-sm text-gray-600">#{ticket.id} opened on {ticket.createdAt}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                                ticket.status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                                {ticket.status}
                            </span>
                        </div>
                        <p className="mt-2 text-gray-700">{ticket.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 