"use client";

import { useState } from "react";
import TicketForm from "@/components/tickets/TicketForm";
import TicketList from "@/components/tickets/TicketList";

export default function HelpDesk() {
    const [tickets, setTickets] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const handleSubmitTicket = (ticketData) => {
        const newTicket = {
            id: Date.now(),
            ...ticketData,
            status: "open",
            createdAt: new Date().toLocaleDateString()
        };
        setTickets([newTicket, ...tickets]);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 pt-20">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Help Desk</h1>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                            {showForm ? "View Tickets" : "Create Ticket"}
                        </button>
                    </div>

                    {showForm ? (
                        <TicketForm onSubmit={handleSubmitTicket} />
                    ) : (
                        <TicketList tickets={tickets} />
                    )}
                </div>
            </div>
        </div>
    );
} 